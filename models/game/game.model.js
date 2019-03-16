const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, require: true},
    name: {type: String, required: true},
    active: {type: Boolean, required: true},
    max_score: {type: Number, required: true},
    game_engine : {type: String, required: true},
    config : {type: String, required: true},
    score_calculator: {type: String, required: true}
})

schema.set('toJSON', {virtual: true})

module.exports = mongoose.model('game', schema)
