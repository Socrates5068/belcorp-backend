import mongoose from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process';
import { dataBaseUrl } from './db.config';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(dataBaseUrl)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        console.log(error.message)
        console.log( colors.red.bold('Error al conectar a MongoDB') )
        exit(1)
    }
}