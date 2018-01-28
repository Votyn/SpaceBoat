const fs = module.require("fs")
const config = require("../config.json");
const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    const logChannel = message.guild.channels.get(config.logChannelID)
    console.log("unmuting...");
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to unmute without sufficient permissions!`); //check permission
    let target = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned user
    if (!target) return console.log(`${message.author.username} failed to specify a user to unmute!`); //check user mentioned

    let role = message.guild.roles.find(r => r.name === "Muted"); //search for role

    target.removeRole(role);
    (await message.channel.send(`${target.user.username} has been unmuted.`)).delete(20000);
    logChannel.send({
        embed: new Discord.RichEmbed()
            .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}`)
            .setFooter(`ID: ${target.id}`)
            .setAuthor(`Member unmuted`, target.user.displayAvatarURL)
            .setTimestamp()
    });
    console.log(`${target.user.username} has been unmuted.`);
}

module.exports.help = {
    name: "unmute"
}