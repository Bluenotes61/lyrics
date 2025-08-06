/**
 * Configuration parameters
 */

require('dotenv').config()

const apiUri = process.env.API_PATH || '/localhost'
const port = process.env.SERVER_PORT || 8080

export default {
  apiPath: `${apiUri}:${port}`,
  serverPort: port,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/mydb',
}
