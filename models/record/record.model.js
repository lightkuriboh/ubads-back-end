const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, required: true},
    game: {type: String, required: true},
    attacker: {type: String, required: true},
    defender: {type: String, required: true},
    result: {type: String, required: true}
})

schema.set('toJSON', {virtuals: true})

module.exports = mongoose.model('record', schema)
