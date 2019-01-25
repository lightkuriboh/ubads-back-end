const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    metadata: {
        email: {type: String, required: true},
        birthday: {type: Date, default: Date.now()},
        name: {type: String, required: true},
        education: {
            identity: {type: String, required: true},
            class: {type: String, required: true},
            generation: {type: String, required: true},
            school: {type: String, required: true}
        }
    }
})

schema.set('toJSON', {virtual: true})

module.exports = mongoose.model('user', schema)
