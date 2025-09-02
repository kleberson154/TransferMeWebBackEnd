import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export interface AuthRequest extends Request {
  user?: any
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: Function
) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }
  const [, token] = authHeader.split(' ')
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' })
  }
}
