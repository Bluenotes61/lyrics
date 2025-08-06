import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import config from './config'
import controllers from './services/controllers'

const connectMongo = async () => {
  try {
    await mongoose.connect(config.dbUri)
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }
}

// connectMongo()

const app = express()

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const router = express.Router()
router.use('/', controllers)

app.use('/', router)

app.listen(config.serverPort, () => {
  console.log(`API running on port ${config.serverPort}`)
})
