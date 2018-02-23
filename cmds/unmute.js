const fs = module.require("fs");
const Discord = module.require("discord.js");
const guilds = require("../configs/guilds.json");

module.exports.run = async (bot, message, args) => {
    console.log("unmuting...");
    // check permission
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to unmute without sufficient permissions!`);
    // get mentioned user
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    // check user mentioned
    if (!target) return console.log(`${message.author.username} failed to specify a user to unmute!`);
    // search for role
    let role = message.guild.roles.find(r => r.name === "Muted");
    // unmute
    target.removeRole(role, `Moderator: ${message.author.username}`);
    // notify
    await message.channel.send(`${target.user.username} has been unmuted.`);
    bot.utils.logChannel(bot, message.guild.id, `Member unmuted.`, target.user, message.author)
    console.log(`${target.user.username} has been unmuted.`);
}

module.exports.help = {
    name: "unmute",
    usage: "unmute <username>",
    description: "Unmutes the specified user."
}