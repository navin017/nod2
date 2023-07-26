const express = require('express')
const app = express()
app.use(express.json())

const router = require('./controller/route')
app.use(router)

// const server = app.listen(8000, function () {
//     console.log("listening to the port %s .....", server.address().port);
// })

module.exports = app;