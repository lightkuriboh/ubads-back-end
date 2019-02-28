const mongoose = require('mongoose')
const config = require('../config/config')
mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise

module.exports = {
    User: require('../models/user/user.model'),
    submission: require('../models/submission/submission.model'),
    record: require('../models/record/record.model'),
    game: require('../models/game/game.model'),
    achievement: require('../models/achievement/achievement.model')
}
