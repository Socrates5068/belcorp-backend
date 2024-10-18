import 'reflect-metadata';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import sectionRoutes from './routes/sectionRoutes';
import documentRoutes from './routes/documentRoutes';
import campaignRoutes from './routes/campaignRoutes';

dotenv.config()
connectDB()
const app = express()
app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

// Leer datos de formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/campaigns', campaignRoutes)

export default app