// a small testing command that is easily editable.
const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (!(message.author.id == config.ownerid)) return;
    console.log(args)
    message.channel.send(`<a:bannedgif:418028681412345862>`)
}

module.exports.help = {
    name: "test",
    type: "Private"
}