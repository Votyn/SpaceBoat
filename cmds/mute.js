const fs = module.require("fs");
const Discord = module.require('discord.js');
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json");
const mutes = require("../configs/mutes.json");

module.exports.run = async (bot, message, args) => {
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

    // THE ACTUAL MUTE BEGINS HERE

    // There are no arguments after the target user is identified
    if (!args[1]) {
        //notify logchannel.
        var timeLog = ''
        var reasonLog = ''
        //notify channel
        message.channel.send(`${target.user.username} has been muted.`).then(m => m.delete(20000));
        //notify console.
        console.log(`${target.user.username} has been muted.`);
        //mute the target user.
        await target.addRole(role, `Moderator: ${message.author.username}`).catch(err => { console.error(err) });
    }

    // There are arguments after the user identification.
    if (args[1]) {
        //is the first argument a number?
        let muteLength = args[1] * 1
        //if so, it's a muteLength!
        if (!isNaN(muteLength)) {
            //if clock supplied, check what clock.
            if (args[2]) {
                if (args[2] == 'seconds' ||
                    args[2] == 'second' ||
                    args[2] == 'secs' ||
                    args[2] == 'sec' ||
                    args[2] == 's') {
                    clock = 'second';
                    multiplier = 1; //filesave multiplies by 1000 by default.
                    var reason = args.splice(3).join(' ')
                }
                if (args[2] == 'minutes' ||
                    args[2] == 'minute' ||
                    args[2] == 'mins' ||
                    args[2] == 'min' ||
                    args[2] == 'm') {
                    clock = 'minute';
                    multiplier = 60; //filesave multiplies by 1000 by default.
                    var reason = args.splice(3).join(' ')
                }
                if (args[2] == 'hours' ||
                    args[2] == 'hour' ||
                    args[2] == 'h') {
                    clock = 'hour';
                    multiplier = 3600; //60 * 60
                    var reason = args.splice(3).join(' ')
                }
                if (args[2] == 'day' ||
                    args[2] == 'days' ||
                    args[2] == 'd') {
                    clock = 'day';
                    multiplier = 86400; //60 * 60 * 24
                    var reason = args.splice(3).join(' ')
                }
            }
            //if no clock supplied, or invalid clock, default to clock of minute.
            if (!args[2] || !clock) {
                var clock = 'minute';
                var multiplier = 60;
                var reason = args.splice(2).join(' ')
            }

            let s = 's'
            if (muteLength == 1) { s = '' }
            
            if (reason) {
                target.send(`**You have been muted for __${muteLength}__ ${clock}${s} the following reason:** ${reason}`)
                    .catch(console.error);
                var reasonLog = '\n**Reason:** ' + reason
                //mute the target user
                await target.addRole(role, `Moderator: ${message.author.username}; Reason: ${reason}`).catch(err => { console.error(err) });
            }
            if (!reason) {
                var reasonLog = ''
                //mute the target user
                await target.addRole(role, `Moderator: ${message.author.username}`).catch(err => { console.error(err) });
            }
            //since it's a timed mute, create a json entry and write to mutes.json
            mutes[target.id] = {
                guild: message.guild.id,
                time: Date.now() + muteLength * multiplier * 1000
            }
            fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                if (err) throw err;
            });
            //notify logchannel.
            var timeLog = `\n**Time:** ${muteLength} ${clock}${s}`
            //notify console
            console.log(`${target.user.username} has been muted for ${muteLength} ${clock}${s}.`);
            //notifychannel.
            (await message.channel.send(`${target.user.username} has been muted for ${muteLength} ${clock}${s}.`)).delete(20000);
        }

        else {
            //notify log
            var reason = args.splice(1).join(' ')
            var reasonLog = `\n**Reason:** ${reason}`
            var timeLog = ''
            //notify user
            target.send(`**You have been muted for the following reason:** ${reason}`)
                .catch(console.error);
            //apply the muted role.
            await target.addRole(role, `Moderator: ${message.author.username}. Reason: ${reason}`).catch(err => { console.error(err) });
            //notify console
            console.log(`${target.user.username} has been muted.`);
            //notifychannel.
            (await message.channel.send(`${target.user.username} has been muted.`)).delete(20000);
        }
    }
    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}${timeLog}${reasonLog}`)
                .setFooter(`ID: ${target.id}`)
                .setAuthor(`Member muted!`, target.user.displayAvatarURL)
                .setTimestamp()
        })
    }
    catch (error) {
        console.log('No logchannel defined for this guild!');
        (await message.channel.send('Please configure a logging channel!')).delete(10000);
    }
    return;
}

module.exports.help = {
    name: "mute",
    usage: "mute <username> <time (in minutes)",
    description: "Mutes the specified user, for an optionally specified amount of time, in minutes."
}