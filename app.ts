import express from 'express'
import path from 'path'
import config from './config'
import controllers from './services/controllers'

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
