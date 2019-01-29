const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const userServices = require('./user/user.controller')
const gameServices = require('./gameinfo/game.controller')
// const achievementServices = require('./achievement/achivement.controller')
app.use('/user', userServices)
app.use('/game', gameServices)
// app.use('/achievement', achievementServices)

module.exports = app
