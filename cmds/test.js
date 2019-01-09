// a small testing command that is easily editable.
const Discord = require('discord.js')

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (!(message.author.id == config.ownerid)) return;
    console.log(message)
    // secret update
}

module.exports.help = {
    name: "test",
    type: "Private"
}