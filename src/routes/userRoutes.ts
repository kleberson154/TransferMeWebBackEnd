import { Router } from 'express'
import User, { IUser } from '../models/User'
import UserController from '../Controller/UserController'

const router: Router = Router()

router.post('/register', async (req, res) => {
  await UserController.register(req, res)
})

router.get('/login', async (req, res) => {
  await UserController.login(req, res)
})

router.post('/deposit', async (req, res) => {
  await UserController.deposit(req, res)
})

router.post('/withdraw', async (req, res) => {
  await UserController.withdraw(req, res)
})

router.post('/transfer', async (req, res) => {
  await UserController.transfer(req, res)
})

export default router
