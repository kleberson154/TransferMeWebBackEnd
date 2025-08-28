import mongoose, { Document, Schema } from 'mongoose'

// Interface do usuário
export interface IUser extends Document {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  balance: number
  limitCredit: number
}

// Criação do schema
const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    limitCredit: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
)

// Criação do modelo
export default mongoose.model<IUser>('User', userSchema)
