const express = require('express')
const router = express.Router()
const userService = require('./user.services')

router.post('/login', authenticate)
router.post('/register', register)
router.get('/', getAll)

module.exports = router

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err))
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}

function getAll(req, res, next) {
    res.json('[]')
}
