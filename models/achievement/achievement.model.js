const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, required: true},
    username: {type: String, required: true},
    game: {type: String, required: true},
    result: {
        rating: {type: Number, required: true},
        score: {type: Number, required: true}
    },
    active_submission: {type: String, required: true}
})

schema.set('toJSON', {virtual: true})

module.exports = mongoose.model('achievement', schema)
