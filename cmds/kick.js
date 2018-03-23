const Discord = require("discord.js");
const guilds = require("../data/guilds.json")

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    console.log("kicking...");
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    if (!message.member.hasPermission("KICK_MEMBERS")) return console.log(`${message.author.username} attempted to kick without sufficient permissions!`); //check permission
    let target = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned member
    if (!target) {
        console.log(`${message.author.username} failed to specify a target user!`);
        (await message.channel.send(`Please specify a target user.`)).delete(5000);
        return; //check if user mentioned
    }
    if (target.hasPermission("MANAGE_MESSAGES")) {
        console.log(`Error: Target user is a moderator.`);
        (await message.channel.send(`${target.user.username} is a moderator!`)).delete(5000);
        return;
    } //Moderators cannot ban other moderators.
    let reason = args.splice(1).join(' ');
    console.log(`${target.user.username} kicked. ${reason}`);
    if (!reason) {
        (await message.channel.send(`${target.user.username} kicked!`)).delete(10000);
        target.kick(`Moderator: ${message.author.username}`);
        bot.utils.logChannel(bot, message.guild.id, `Member kicked!`, target.user, message.author)
    }
    if (reason) {
        // notify user
        target.send(`**You have been kicked for the following reason:** ${reason}`)
            .catch(console.error);
        // kick
        target.kick(`Moderator: ${message.author.username}. Reason: ${reason}`);
        // notify channel
        await message.channel.send(`${target.user.username} kicked!`);
        // notify logchannel
        bot.utils.logChannel(bot, message.guild.id, `Member kicked!`, target.user, message.author, reason)
    }
    return;
}

module.exports.help = {
    name: "kick",
    usage: "kick <username> <reason>",
    type: "Moderation",
    description: "Kicks the specified user, with an optional reason."
}