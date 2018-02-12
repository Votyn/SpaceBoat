const Discord = require("discord.js");
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json")

module.exports.run = async (client, message, args) => {
    console.log("kicking...");
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to kick without sufficient permissions!`); //check permission
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
    } //Moderators cannot mute other moderators.
    let reason = args.splice(1).join(' ');
    console.log(`${target.user.username} kicked. ${reason}`);
    if (!reason) {
        (await message.channel.send(`${target.user.username} kicked!`)).delete(10000);
        target.kick(`Moderator: ${message.author.username}`);
        try {
            logChannel.send({
                embed: new Discord.RichEmbed()
                    .setDescription(`**Member kicked:** ${target}\n**Moderator:** ${message.author}`)
                    .setFooter(`ID: ${target.id}`)
                    .setAuthor(`Member kicked!`, target.user.displayAvatarURL)
                    .setTimestamp()
            });
        }
        catch (error) {
            console.log('No logchannel defined for this guild!');
            (await message.channel.send('Please configure a logging channel!')).delete(10000);
        }
    }
    if (reason) {
        DMchannel = await target.createDM()
        DMchannel.send(`**You have been kicked for the following reason:** ${reason}`);
        (await message.channel.send(`${target.user.username} kicked!`)).delete(10000);
        target.kick(`Moderator: ${message.author.username}. Reason: ${reason}`);
        try {
            logChannel.send({
                embed: new Discord.RichEmbed()
                    .setDescription(`**Member kicked:** ${target}\n**Moderator:** ${message.author}\n**Reason:** ${reason}`)
                    .setFooter(`ID: ${target.id}`)
                    .setAuthor(`Member kicked!`, target.user.displayAvatarURL)
                    .setTimestamp()
            });
        }
        catch (error) {
            console.log('No logchannel defined for this guild!');
            (await message.channel.send('Please configure a logging channel!')).delete(10000);
        }
    }
    return;
}

module.exports.help = {
    name: "kick",
    usage: "kick <username> <reason>",
    description: "Kicks the specified user, with an optional reason."
}