/**
 * Configuration parameters
 */

require('dotenv').config()

const apiUri = process.env.API_PATH || '/localhost'
const port = process.env.SERVER_PORT || 8080

export default {
  apiPath: `${apiUri}:${port}`,
  serverPort: port
}
