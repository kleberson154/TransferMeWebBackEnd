import { Response } from 'express'
import { AuthRequest } from '../types/express'
import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'

class UserController {
  async register(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const { email, senha, nome, sobrenome, telefone } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        res.status(409).json({ error: 'Usuário já existe' })
        return
      }

      const newUser: IUser = new User({
        email,
        password: senha,
        firstName: nome,
        lastName: sobrenome,
        phone: telefone
      })

      await newUser.save()

      const { password, ...userData } = newUser.toObject()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar usuário' })
    }
  }

  async login(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

      const user = await User.findOne({ email })
      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' })
        return
      }

      const isMatch = await (user as any).comparePassword(password)
      if (!isMatch) {
        res.status(401).json({ error: 'Credenciais inválidas' })
        return
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h'
      })

      const { password: _, ...safeUser } = user.toObject()
      res.status(200).json({ user: safeUser, token })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' })
    }
  }

  async getUserData(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const user = await User.findById(req.user!.id).select('-password')
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' })
        return
      }
      res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados do usuário' })
    }
  }

  async deposit(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const { value } = req.body
      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { $inc: { balance: value } },
        { new: true }
      ).select('-password')

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' })
        return
      }

      res.json({ user })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao depositar' })
    }
  }

  async withdraw(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const { value } = req.body
      const user = await User.findById(req.user!.id)
      if (!user)
        return res.status(404).json({ error: 'Usuário não encontrado' })

      if (user.balance < value) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }

      user.balance -= value
      await user.save()

      const { password, ...safeUser } = user.toObject()
      res.json({ user: safeUser })
    } catch (err) {
      res.status(500).json({ error: 'Erro no saque' })
    }
  }

  async transfer(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const { email, value } = req.body
      const from = await User.findById(req.user!.id)
      const to = await User.findOne({ email })

      if (!from || !to) {
        return res
          .status(404)
          .json({ error: 'Conta remetente ou destinatária não encontrada' })
      }

      if (from.balance < value) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }

      from.balance -= value
      to.balance += value

      await from.save()
      await to.save()

      res.json({
        from: { ...from.toObject(), password: undefined },
        to: { ...to.toObject(), password: undefined }
      })
    } catch (err) {
      res.status(500).json({ error: 'Erro na transferência' })
    }
  }
}

export default new UserController()
