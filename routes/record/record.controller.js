const express = require('express')
const router = express.Router()
const Records = require('./record.services')

router.get('/', getAll)

module.exports = router

function getAll (req, res, next) {
    Records.getAll()
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}
