import express, { Application } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'

dotenv.config()

const app: Application = express()

// Middleware
app.use(cors())
app.use(express.json())

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Conectado ao MongoDB')
  })
  .catch(error => {
    console.error('Erro ao conectar ao MongoDB:', error)
  })

// Rotas
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Servidor rodando na porta:', PORT)
})
