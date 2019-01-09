const Discord = require('discord.js')
module.exports.run = async (bot, message, args) => {
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    var sendAvatar = (person) => {
        message.channel.send(new Discord.RichEmbed().setImage(person.displayAvatarURL).setColor(bot.colour).setDescription(`Here's <@${person.id}>'s avatar!`))
    }
    if (!target) {
        if (!message.avatarURL) {
            sendAvatar(message.author)
        }
    }
    else {
        if (!message.avatarURL) {
            sendAvatar(target.user)
        }
        else {
            sendAvatar(target)
        }
    }
}
module.exports.help = {
    name: "avatar",
    usage: 'avatar [mention/user id]',
    type: 'Fun',
    description: 'Returns your or another person\'s avatar!'
}