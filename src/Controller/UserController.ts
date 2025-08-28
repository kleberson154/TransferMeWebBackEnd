import { Request, Response } from 'express'
import User, { IUser } from '../models/User'

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone } = req.body
      const newUser: IUser = new User({
        email,
        password,
        firstName,
        lastName,
        phone
      })
      await newUser.save()
      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar usuário' })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email, password })
      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' })
        return
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' })
    }
  }

  async deposit(req: Request, res: Response): Promise<void> {
    try {
      const { idUser, value } = req.body
      const user = await User.findOneAndUpdate(
        { _id: idUser },
        { $inc: { balance: value } },
        { new: true }
      )
      res.json(user)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  // Saque
  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const { idUser, value } = req.body
      const user = await User.findOne({ _id: idUser })
      if (!user) {
        res.status(404).json({ error: 'Conta não encontrada' })
        return
      }
      if (user.balance < value) {
        res.status(400).json({ error: 'Saldo insuficiente' })
        return
      }
      user.balance -= value
      await user.save()
      res.json(user)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  // Transferência
  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const { idUser, inputEmail, value } = req.body

      const from = await User.findOne({ _id: idUser })
      const to = await User.findOne({ email: inputEmail })

      if (!from || !to) {
        res
          .status(404)
          .json({ error: 'Conta remetente ou destinatária não encontrada' })
        return
      }
      if (from.balance < value) {
        res.status(400).json({ error: 'Saldo insuficiente' })
        return
      }

      from.balance -= value
      to.balance += value

      await from.save()
      await to.save()

      res.json({ from, to })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default new UserController()
