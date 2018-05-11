const Discord = require('discord.js')

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (message.author.id != config.ownerid) return;
    let emoji = args[0]
    if (emoji[0] == '<') return message.channel.send('Invalid emoji. Please use a standard, non-custom emoji.');
    let rolename = args[1]
    var role = message.guild.roles.find('name', rolename);
    if (!role) return message.channel.send('Role not found, please create role.')
    let sentmsg = await message.channel.send(message.content.slice(18 + args[0].length + args[1].length))
    // if (emoji[0] == '<') {
    //     emoji = args[0].split(':')[2].split('>')[0]
    //     let filter = ((reaction, user) => reaction.emoji.name === emoji && user)
    // } else { 
    //     emoji = args[0]
    // };
    let collector = await sentmsg.createReactionCollector((reaction, user) => reaction.emoji.name === emoji && user)
    collector.on('collect', r => {
        let user = r.users.find('bot', false)
        if (!user) return;
        r.message.guild.member(user).addRole(role).catch(error => console.log(error.message))
        r.remove(user)
    });
    sentmsg.react(emoji);
}

module.exports.help = {
    name: "newcomerbuffer",
    type: "Administration",
    usage: "newcomerbuffer <emoji (standard, non-custom emojis only)> <role name (one word only)> <message>",
    description: "Creates a new message sent by the bot that will wait for reactions to that message that are the same emoji as stated in the command, and apply the stated role."
}