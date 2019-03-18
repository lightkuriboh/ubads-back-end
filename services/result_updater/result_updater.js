
module.exports = {
    update_all
}

const db = require('../../helpers/db')
const Submission = db.submission
const Achievement = db.achievement
const Record = db.record
const AchievementServices = require('../../routes/achievement/achivement.services')

// update_all('1552927096298', '0', 'hekl0', 'lightkuriboh', '../../game_engines/bomber/score_calculator.js')

async function update_all (id, game, attacker, defender, score_calculator) {
    await update_result(id, game, attacker, defender, score_calculator)
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

async function update_result (id, game, attacker, defender, score_calculator) {
    const fs = require('fs')
    const path = 'fight_result/' + id.toString() + '.result'
    // console.log(path)
    if (fs.existsSync(path)) {
        // console.log('File found')
        let all_result = await fs.readFileSync(path, "utf8")
        /**
         * type and result
         * type = 0 mean normal fight
         * type = 1 mean fight with computer
         */
        let returned_value = parse_result_str(all_result, 0, '*')
        let result = returned_value[0]
        /**
         * Detect if the fight is PvP or PvE
         * @type {number}
         */
        let type = 0
        if (defender === 'Computer') {
            type = 1
        }
        if (type === 0) { // PvP
            /**
             * Update Loose / Draw
             */
            update_record(id, result)
            if (result === '1') { // win
                /**
                 * get the rating change by rating calculator
                 * @type {number|*}
                 */
                let rating_change = await rating_calculator(game, attacker, defender)
                let current_achievement_info = await AchievementServices.getUserInfo({username: attacker, game: game})
                let current_rating = current_achievement_info.result.rating
                // console.log(rating_change, current_rating)
                /**
                 * Update Win with rating
                 */
                update_record(id, '+' + rating_change.toString())
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
                // console.log(current_submission_id)
                let current_submission = await Submission.findOne({
                    id: current_submission_id
                })
                let new_best_rating = current_submission.best_rating
                // console.log(new_best_rating)
                if (current_rating + rating_change > new_best_rating) {
                    new_best_rating = current_rating + rating_change
                }
                await Submission.updateOne({
                    id: current_submission_id
                }, {
                    best_rating: new_best_rating
                })
            }
        } else { // PvE
            let score_attacker = returned_value[1]
            let score_defender = returned_value[2]
            const score_calculator = require(score_calculator)
            const details = score_calculator.score_calculating(score_attacker, score_defender)
            let score_change = details.score

            /**
             * Update to record
             * @type {*|*}
             */
            update_record(id, details)

            let current_achievement_info = await AchievementServices.getUserInfo({username: attacker, game: game})
            let current_score = current_achievement_info.result.score
            /**
             * update score of the attacker's achievement
             */
            await Achievement.updateOne({
                username: attacker,
                game: game
            }, {
                result: {
                    score: score_change
                }
            })

            /**
             * update best_score of current active submission
             * @type {active_submission|{type, required}}
             */
            let current_submission_id = current_achievement_info.active_submission
            let current_submission = Submission.findOne({
                id: current_submission_id
            })
            let new_best_score = current_submission.best_score
            if (score_change > new_best_score) {
                new_best_score = score_change
            }
            await Submission.updateOne({
                id: current_submission_id
            }, {
                best_score: new_best_score
            })
        }
    } else {
        console.log('Result file not exist!')
    }
}


async function rating_calculator (game, attacker, defender) {
    const info_attacker = await AchievementServices.getUserInfo({username: attacker, game: game})
    const info_defender = await AchievementServices.getUserInfo({username: defender, game: game})
    let attacker_rating = info_attacker.result.rating
    let defender_rating = info_defender.result.rating
    if (attacker_rating === defender_rating) {
        return 1
    } else {
        if (attacker_rating <= defender_rating) {
            return Math.ceil((defender_rating - attacker_rating) * 0.6)
        } else {
            return 0
        }
    }
}


async function update_record (id, result) {
    let query = {
        id: id
    }
    let status = 'Loose'
    if (result.length > 0 && result[0] === '+') { // rating change
        status = result
    } else {
        if (result === '1') {
            status = 'Win'
        } else {
            if (result === '0') {
                status = 'Draw'
            } else {  // is object
                let score = result.score
                let max_score = result.max_score
                status = score.toString() + '/' + max_score.toString()
            }
        }
    }
    let update = {
        result: status
    }
    // console.log(query, update)
    await Record.updateOne(query, update)
}



