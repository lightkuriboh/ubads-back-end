const express = require('express')
const router = express.Router()
const Languages = require('./languages.services')

router.get('/', getAll)

module.exports = router

function getAll (req, res, next) {
    Languages.getListLanguages()
        .then(
            (result) => result ? res.json(result) : res.json("[]")
        )
        .catch((err) => {
            console.log(err)
            next(err)
        })
}


