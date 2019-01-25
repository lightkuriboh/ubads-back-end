const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise

module.exports = {
    User: require('../models/user.model'),
    submission: require('../models/submission.model'),
    record: require('../models/record.model'),
    game: require('../models/game.model'),
    achievement: require('../models/achievement.model')
}
