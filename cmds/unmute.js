const fs = module.require("fs");
const Discord = module.require("discord.js");
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json");

module.exports.run = async (client, message, args) => {
    console.log("unmuting...");
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to unmute without sufficient permissions!`); //check permission
    let target = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned user
    if (!target) return console.log(`${message.author.username} failed to specify a user to unmute!`); //check user mentioned

    let role = message.guild.roles.find(r => r.name === "Muted"); //search for role

    target.removeRole(role, `Moderator: ${message.author.username}`);
    (await message.channel.send(`${target.user.username} has been unmuted.`)).delete(20000);
    try {    
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}`)
                .setFooter(`ID: ${target.id}`)
                .setAuthor(`Member unmuted`, target.user.displayAvatarURL)
                .setTimestamp()
        })
    }
    catch (error) {
        console.log('No logchannel defined for this guild!');
        (await message.channel.send('Please configure a logging channel!')).delete(10000);
    }
    console.log(`${target.user.username} has been unmuted.`);
}

module.exports.help = {
    name: "unmute",
    usage: "unmute <username>",
    description: "Unmutes the specified user."
}