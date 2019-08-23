// a small testing command that is easily editable.
const Discord = require('discord.js')

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if(bot.thanos.includes(message.author.id)) {
        (await message.channel.send(new Discord.RichEmbed()
                                                    .setImage('https://media1.tenor.com/images/e36fb32cfc3b63075adf0f1843fdc43a/tenor.gif?itemid=12502580')
                                                    .setColor(bot.colour)
        )).delete(30000)
        .then(message.delete())
        .catch(console.error)
        
    }
}

module.exports.help = {
    name: "snap",
    type: "Private"
}