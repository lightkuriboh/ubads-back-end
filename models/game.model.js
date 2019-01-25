const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    name: {type: String, required: true},
    active: {type: Boolean, required: true}
})

schema.set('toJSON', {virtual: true})

module.exports = mongoose.model('game', schema)
