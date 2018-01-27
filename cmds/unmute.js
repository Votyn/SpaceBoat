const fs = module.require("fs")
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    const logChannel = message.guild.channels.get(config.logChannelID)
    console.log("unmuting...");
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to unmute without sufficient permissions!`); //check permission
    let toUnmute = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned user
    if (!toUnmute) return console.log(`${message.author.username} failed to specify a user to unmute!`); //check user mentioned

    let role = message.guild.roles.find(r => r.name === "Muted"); //search for role

    toUnmute.removeRole(role);
    (await message.channel.send(`${toUnmute.user.username} has been unmuted.`)).delete(20000);
    logChannel.send(`${toUnmute.user.username} has been unmuted.`);
    console.log(`${toUnmute.user.username} has been unmuted.`);
}

module.exports.help = {
    name: "unmute"
}