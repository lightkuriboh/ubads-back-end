
module.exports = {
    score_calculating
}

function score_calculating (score_attacker, score_defender) {
    return {
        score: min(100, max(0, 100 * ((score_attacker - score_defender) / score_defender))),
        max_score: 100
    }
}
