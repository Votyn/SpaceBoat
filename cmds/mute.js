const fs = module.require("fs");
const Discord = module.require('discord.js');
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json");
const mutes = require("../configs/mutes.json");

module.exports.run = async (client, message, args) => {
    console.log("muting...");
    //import logChannel.
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    //check permissions.
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to mute without sufficient permissions!`);
    //import target member from the message.
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    //breaks if there is no target member.
    if (!target) return console.log(`${message.author.username} failed to specify a user to mute!`);
    //checks if target is a moderator.
    if (target.hasPermission("MANAGE_MESSAGES")) {
        console.log(`Error: ${target.user.username} is a moderator.`);
        (await message.channel.send(`${target.user.username} is a moderator!`)).delete(5000);
        return;
    }
    //searches for the role
    let role = message.guild.roles.find(r => r.name === "Muted");
    //makes sure that the bot's highest role is above the muted role.
    if (message.guild.me.highestRole.comparePositionTo(role) < 1) {
        console.log(`ERROR: Cannot assign Muted role!`);
        try {
            logChannel.send(`ERROR: Cannot assign Muted role!`);
        }
        catch (error) {
            console.log('No logchannel defined for this guild!');
            (await message.channel.send('Please configure a logging channel!')).delete(10000);
        }
        return;
    }
    //if no muted role exists, create it.
    if (!role) {
        try {
            role = await message.guild.createRole({
                name: "muted",
                color: "#8a",
                permissions: []
            });
            
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
            console.log('Created muted role');
        } catch (error) {
            console.log(error.stack);
        }
    }

    //checks if member already muted.
    if (target.roles.has(role.id)) {
        console.log(`${target.user.username} already muted!`);
        (await message.channel.send(`${target.user.username} already muted!`)).delete(5000);
        return;
    }

    await target.addRole(role);

    if (args[1]) {
        if (args[2]) {
            if (args[2] == 'seconds' ||
                args[2] == 's' ||
                args[2] == 'sec' ||
                args[2] == 'secs' ||
                args[2] == 'second') {
                clock = 'second';
                multiplier = 1;
            }
            if (args[2] == 'hour' ||
                args[2] == 'hours' ||
                args[2] == 'h') {
                clock = 'hour';
                multiplier = 3600;
            }
            if (args[2] == 'day' ||
                args[2] == 'days' ||
                args[2] == 'd') {
                clock = 'day';
                multiplier = 86400;
            }
        }
        if (!(args[2] || !clock)) {
            clock = 'minute';
            multiplier = 60;
        }
        mutes[target.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * multiplier * 1000
        }
        fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
            if (err) throw err;
        });
        let s = 's'
        if (args[1] == 1) { s = '' }
        try {
            logChannel.send({
                embed: new Discord.RichEmbed()
                    .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}\n**Time:** ${args[1]} ${clock}${s}.`)
                    .setFooter(`ID: ${target.id}`)
                    .setAuthor(`Member muted!`, target.user.displayAvatarURL)
                    .setTimestamp()
            })
        }
        catch (error) {
            console.log('No logchannel defined for this guild!');
            (await message.channel.send('Please configure a logging channel!')).delete(10000);
        }
        console.log(`${target.user.username} has been muted for ${args[1]} ${clock}${s}.`);
        (await message.channel.send(`${target.user.username} has been muted for ${args[1]} ${clock}${s}.`)).delete(20000);
    }

    if (!args[1]) {
        (await message.channel.send(`${target.user.username} has been muted.`)).delete(20000);
        try {
            logChannel.send({
                embed: new Discord.RichEmbed()
                    .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}`)
                    .setFooter(`ID: ${target.id}`)
                    .setAuthor(`Member muted!`, target.user.displayAvatarURL)
                    .setTimestamp()
            })
        }
        catch (error) {
            console.log('No logchannel defined for this guild!');
            (await message.channel.send('Please configure a logging channel!')).delete(10000);
        }
        console.log(`${target.user.username} has been muted.`);
    }

    return;
}

module.exports.help = {
    name: "mute",
    usage: "mute <username> <time (in minutes)",
    description: "Mutes the specified user, for an optionally specified amount of time, in minutes."
}