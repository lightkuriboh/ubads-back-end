const express = require('express')
const router = express.Router()
const Games = require('./game.services')
const config = require('../../config/config')
const jwt = require('express-jwt')

router.get('/', getAll)
router.post('/id', getByID)

module.exports = router

function getAll (req, res, next) {
    Games.getAll()
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}

function getByID (req, res, next) {
    Games.getByID(req.body)
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}
