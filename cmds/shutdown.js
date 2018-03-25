const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    console.log(message.author.id)
    if (!(message.author.id == config.ownerid)) return;
    console.log(`shutting down...`)
    bot.destroy()
}

module.exports.help = {
    name: "shutdown",
    type: "Private"
}