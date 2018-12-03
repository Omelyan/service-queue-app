const express = require('express')
const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const cors = require('cors')

const app = express()

app.use(morgan('combined'))

app.get('/status', (req, res) => {
  res.send({
    message: 'Hello'
  })
})

app.listen(process.env.PORT || 8081)
