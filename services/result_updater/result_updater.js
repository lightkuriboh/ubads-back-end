
module.exports = {
    update_all
}

const db = require('../../helpers/db')
const Submission = db.submission
const Achievement = db.achievement
const Record = db.record
const AchievementServices = require('../../routes/achievement/achivement.services')

update_all('ID', '0', 'hekl0', 'lightkuriboh')

async function update_all (id, game, attacker, defender) {
    await update_result(id, game, attacker, defender)
}

function parse_result_str (result, startIndex, special_character) {
    let returned_values = []
    let returned_item = ''
    for (let i = startIndex; i < result.length; i++) {
        if (result[i] !== special_character) {
            returned_item += result[i]
        } else {
            returned_values.push(returned_item)
            returned_item = ''
        }
    }
    return returned_values
}

async function update_result (id, game, attacker, defender) {
    const fs = require('fs')
    const path = '../../fight_result/' + id.toString() + '.result'
    if (fs.existsSync(path)) {
        let all_result = await fs.readFileSync(path, "utf8")
        /**
         * type and result
         * type = 0 mean normal fight
         * type = 1 mean fight with computer
         */
        let returned_value = parse_result_str(all_result, 0, '*')
        let type = returned_value[0]
        let result = returned_value[1]
        if (type === '0') { // PvP
            if (result === '1') { // win
                let score_attacker = returned_value[2]
                let score_defender = returned_value[3]
                /**
                 * get the rating change by rating calculator
                 * @type {number|*}
                 */
                let rating_change = await rating_calculator(game, attacker, defender, parseInt(score_attacker), parseInt(score_defender))
                let current_achievement_info = await AchievementServices.getUserInfo({username: attacker, game: game})
                let current_rating = current_achievement_info.result.rating
                let current_score = current_achievement_info.result.score
                /**
                 * update rating of the attacker's achievement
                 */
                await Achievement.updateOne({
                    username: attacker,
                    game: game
                }, {
                    result: {
                        rating: current_rating + rating_change
                    }
                })
                /**
                 * update rating of the defender's achievement
                 */
                await Achievement.updateOne({
                    username: defender,
                    game: game
                }, {
                    result: {
                        rating: current_rating - rating_change
                    }
                })
                /**
                 * update best_rating of current active submission
                 * @type {active_submission|{type, required}}
                 */
                let current_submission_id = current_achievement_info.active_submission
                let current_submission = Submission.findOne({
                    id: current_submission_id
                })
                let new_best_rating = current_submission.best_rating
                if (current_rating + rating_change > new_best_rating) {
                    new_best_rating = current_rating + rating_change
                }
                await Submission.updateOne({
                    id: current_submission_id
                }, {
                    best_rating: new_best_rating
                })
            }
        } else {
            let current_score = parseInt(result)
            /**
             * update score of the current attacker
             * @type {{username: *, game: *}}
             */
            let query = {
                username: attacker,
                game: game
            }
            let update = {
                result: {
                    score: current_score
                }
            }
            let current_achievement_info = await AchievementServices.getUserInfo({username: attacker, game: game})
            await Achievement.updateOne(query, update)
            /**
             * update best_score of current active submission
             * @type {active_submission|{type, required}}
             */
            let current_submission_id = current_achievement_info.active_submission
            let current_submission = Submission.findOne({
                id: current_submission_id
            })
            let new_best_score = current_submission.best_score
            if (current_score > new_best_score) {
                new_best_score = current_score
            }
            await Submission.updateOne({
                id: current_submission_id
            }, {
                best_rating: new_best_score
            })
        }
    } else {
        console.log('Result file not exist!')
    }
}


async function rating_calculator (game, attacker, defender, score_attacker, score_defender) {
    const info_attacker = await AchievementServices.getUserInfo({username: attacker, game: game})
    const info_defender = await AchievementServices.getUserInfo({username: defender, game: game})
    let attacker_rating = info_attacker.result.rating
    let defender_rating = info_defender.result.rating
    if (attacker_rating === defender_rating) {
        return 1
    } else {
        if (attacker_rating <= defender_rating) {
            return Math.ceil((defender_rating - attacker_rating) * (0.5 + (score_attacker - score_defender) / score_defender))
        } else {
            return 0
        }
    }
}



