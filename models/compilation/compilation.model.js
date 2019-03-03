const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    id: {type: String, required: true},
    language: {type: String, required: true},
    result: {type: String, required: true}
})

schema.set('toJSON', {virtual: true})

module.exports = mongoose.model('compilation', schema)
