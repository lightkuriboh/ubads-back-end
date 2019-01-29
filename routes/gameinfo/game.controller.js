const express = require('express')
const router = express.Router()
const Games = require('./game.services')

router.get('/', getAll)

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
