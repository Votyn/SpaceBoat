const fs = module.require("fs");
const Discord = module.require('discord.js');
const guilds = require("../data/guilds.json");

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    console.log("Removing roles...");
    //import logChannel.
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    //check permissions.
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to remove roles without sufficient permissions!`);
    //import target member from the message.
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    // Get roles the user has
    let listroles = target.roles.map(r => r.id);
    //breaks if there is no target member.
    if (!target) {
        console.log(`${message.author.username} failed to specify a user to remove roles from!`    
        return;
    }
    //checks if target is a moderator.
    if (target.hasPermission("MANAGE_MESSAGES")) {
        console.log(`Error: ${target.user.username} is a moderator.`);
        (await message.channel.send(`${target.user.username} is a moderator!`)).delete(10000);
        return;
    }
    //searches for the role;
    // There are no arguments after the target user is identified
    if (!args[1]) {
        //notify logchannel.
        bot.utils.logChannel(bot, message.guild.id, `Member's roles removed!`, target.user, message.author)
        //notify channel
        message.channel.send(`${target.user.username}'s roles have been removed`);
        //notify console.
        console.log(`${target.user.username}'s roles have been removed`);
        // Remove all roles from user
        await target.removeRoles(listroles, `Moderator: ${message.author.username}`).catch(err => { console.error(err) });
    }
    // If there are arguments send that it doesn't take arguments

    var reason = args.splice(1).join(' ')
    if (reason) {
        // notify logchannel
        bot.utils.logChannel(bot, message.guild.id, `Member's roles removed!`, target.user, message.author, reason)
    }
    if (!reason) {
        var reason = ''
    }
 }
    
}
module.exports.help = {
    name: "removeroles",
    usage: "removeroles <username>",
    type: "Moderation",
    description: "Removes all roles from user"
}
