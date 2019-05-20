require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
process.env.NODE_ENV = process.env.NODE_ENV || 'test'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/', require('./routes'))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app