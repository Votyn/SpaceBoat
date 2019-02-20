// a small testing command that is easily editable.
const Discord = require('discord.js')

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if(bot.thanos.includes(message.author.id)) {
        message.channel.send(new Discord.RichEmbed()
                                                    .setImage('https://media1.tenor.com/images/e36fb32cfc3b63075adf0f1843fdc43a/tenor.gif?itemid=12502580')
                                                    .setColor(bot.colour)
        )
        .catch(console.error);
    }
}

module.exports.help = {
    name: "test",
    type: "Private"
}