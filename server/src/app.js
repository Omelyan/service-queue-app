const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const Queue = require('./routers/Queue')
const config = require('./config/config')

app.use(bodyParser.json())
app.use(cors())
app.use('/queue', Queue)

app.listen(config.port)
console.log(`Service Queue service started on port ${config.port}`)
