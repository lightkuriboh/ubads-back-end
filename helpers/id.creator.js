
module.exports = {
    createID
}

function createID () {
    let dateNow = new Date()
    let id = Date.parse(dateNow.toString())
    let random = Math.floor(Math.random() * 1000 + 1);
    id += random
    return id.toString()
}
