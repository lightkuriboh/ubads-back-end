const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const userServices = require('./user/user.controller')
const gameServices = require('./gameinfo/game.controller')
const recordServices = require('./record/record.controller')
const viewLogServices = require('./viewlog/viewlog.controller')
const viewCodeServices = require('./viewcode/viewcode.controller')
const languagesServices = require('./language/languages.controller')
const submissionServices = require('./submission/submission.controller')
const achievementServices = require('./achievement/achivement.controller')

app.use('/user', userServices)
app.use('/game', gameServices)
app.use('/record', recordServices)
app.use('/log', viewLogServices)
app.use('/code', viewCodeServices)
app.use('/lang', languagesServices)
app.use('/submission', submissionServices)
app.use('/achievement', achievementServices)


module.exports = app
