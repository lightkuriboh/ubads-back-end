const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, required: true},
    owner: {type: String, required: true},
    game: {type: String, required: true},
    best_rating: {type: String, required: true},
    best_score: {type: String, required: true},
    time: {type: String, required: true}
})

schema.set('toJSON', {virtuals: true})

module.exports = mongoose.model('submission', schema)
