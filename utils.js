// const bot = require('./bot');
const Discord = require('discord.js');
const guilds = require("./configs/guilds.json")

exports.logChannel = (bot, guildID, event, user, moderator, reason, timeString) => {
    if (!guildID) return console.log(`guildID is not defined!`);
    // identify the logger channel
    let logChannel = (bot.guilds.get(guildID)).channels.get(guilds[guildID].logChannelID)
    // check if there is a moderator parameter
    if (moderator) { var moderatorString = `\n**Moderator:** ${moderator} (${moderator.tag})` }
    if (!moderator || moderator == '') { var moderatorString = '' }
    // check for reason
    if (reason) { var reasonString = `\n**Reason:** ${reason}` }
    if (!reason || reason == '') { var reasonString = '' }
    // check for timeString
    if (!timeString || timeString == '') { var timeString = '' }
    //do the actual embed
    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setDescription(`**Target:** ${user} (${user.tag})${moderatorString}${reasonString}${timeString}`)
                .setFooter(`ID: ${user.id}`)
                .setAuthor(event, user.displayAvatarURL)
                .setTimestamp()
        })
    }
    catch (error) {
        if (!guildID) return console.log(`LoggerERR: No guildID given!`)
        if (!logChannel) return console.log(`LoggerERR: No logchannel defined for this guild!`)
        else console.log(error)
    }
}

exports.randomSelection = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
}