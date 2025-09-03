import { Router } from 'express'
import User, { IUser } from '../models/User'
import UserController from '../Controller/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post('/register', async (req, res) => {
  await UserController.register(req, res)
})

router.post('/', async (req, res) => {
  await UserController.login(req, res)
})

router.get('/home', authMiddleware, async (req, res) => {
  try {
    const user = await UserController.getUserData(req, res)
    res.json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
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
