import { Router } from 'express'
import User, { IUser } from '../models/User'
import UserController from '../Controller/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post('/register', async (req, res) => {
  await UserController.register(req, res)
})

router.get('/login', async (req, res) => {
  await UserController.login(req, res)
})

router.get('/home', authMiddleware, async (req, res) => {
  res.json({ message: 'Bem-vindo à sua conta!' })
})

router.post('/deposit', authMiddleware, async (req, res) => {
  await UserController.deposit(req, res)
})

router.post('/withdraw', authMiddleware, async (req, res) => {
  await UserController.withdraw(req, res)
})

router.post('/transfer', authMiddleware, async (req, res) => {
  await UserController.transfer(req, res)
})

export default router
