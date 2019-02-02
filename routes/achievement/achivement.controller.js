const express = require('express')
const router = express.Router()
const Achivement = require('./achivement.services')
const Users = require(('../user/user.services'))

router.get('/', getAll)
router.post('/game', getGame)

module.exports = router

function getAll (req, res, next) {
    Achivement.getAll()
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}

function getGame (req, res, next) {
    Achivement.getGame(req.body)
        .then(
            async (result) => {
                let response = []
                for (let i = 0; i < result.length; i++) {
                    let un = {username: result[i].username}
                    let userInfo = await Users.getInfoByUsername(un)
                    let item = {
                        resultDetails: result[i].result,
                        userDetails: userInfo
                    }
                    response.push(item)
                }
                res.json(response)
            }
        )
        .catch(
            (err) => {
                next(err)
            }
        )
}
