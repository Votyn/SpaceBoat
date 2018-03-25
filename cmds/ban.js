const fs = module.require("fs");
const Discord = require("discord.js");
const guilds = require("../data/guilds.json")
const bans = module.require("../data/bans.json");

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    console.log("banning...");
    //load logChannel
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    //can this user ban members?
    if (!message.member.hasPermission("BAN_MEMBERS")) return console.log(`${message.author.username} attempted to ban without sufficient permissions!`);
    //Get the mentioned member object
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    //No member specified?
    if (!target) {
        console.log(`${message.author.username} failed to specify a target user!`);
        (await message.channel.send(`Please specify a target user.`)).delete(5000);
        return;
    }
    //Can the target member be banned?
    if (target.hasPermission("MANAGE_MESSAGES")) {
        console.log(`Error: Target user is a moderator.`);
        (await message.channel.send(`${target.user.username} is a moderator!`)).delete(5000);
        return;
    }

    // THE ACTUAL BAN BEGINS HERE

    // If there are no arguments after the target user is identified
    if (!args[1]) {
        //notify logchannel.
        bot.utils.logChannel(bot, message.guild.id, `Member banned!`, target.user, message.author)
        //notify channel
        message.channel.send(`${target.user.username} has been banned!`).then(m => m.delete(20000));
        //notify console.
        console.log(`${target.user.username} has been banned!`);
        //ban the target user.
        target.ban(`Moderator: ${message.author.username}`)
    }

    // There are arguments after the user identification.
    if (args[1]) {
        //is the first argument a number?
        let banPeriod = args[1] * 1
        //if so, it's a banPeriod!
        if (!isNaN(banPeriod)) {
            //if clock supplied, check what clock.
            if (args[2] == 'day' ||
                args[2] == 'days' ||
                args[2] == 'd') {
                clock = 'day';
                multiplier = 24; //
                var reason = args.splice(3).join(' ')
            }
            if (args[2] == 'hour' ||
                args[2] == 'hours' ||
                args[2] == 'h') {
                clock = 'hour';
                multiplier = 1; //
                var reason = args.splice(3).join(' ')
            }
            if (args[2] == 'week' ||
                args[2] == 'weeks' ||
                args[2] == 'w') {
                clock = 'week';
                multiplier = 604800; //60 * 60 * 24 * 7
                var reason = args.splice(3).join(' ')
            }

            //if no clock supplied, or invalid clock, default to clock of hour.
            if (!args[2] || !clock) {
                var clock = 'hour';
                var multiplier = 1;
                var reason = args.splice(2).join(' ')
            }

            let s = 's'
            if (banPeriod == 1) { s = '' }

            if (reason) {
                await target.send(`**You have been banned for __${banPeriod} ${clock}${s}__ with the following reason:** ${reason}`)
                            .catch(console.error);
                //ban the target user
                target.ban(`Moderator: ${message.author.username}; Reason: ${reason}`)
            }
            if (!reason) {
                var reason = ''
                await target.send(`**You have been banned for __${banPeriod} ${clock}${s}__**`)
                            .catch(console.error);
                //ban the target user
                target.ban(`Moderator: ${message.author.username}`)
            }
            //since it's a timed ban, create a json entry and write to bans.json
            bans[target.id] = {
                guild: message.guild.id,
                time: Date.now() + banPeriod * multiplier * 3600000
            }
            fs.writeFileSync("./data/bans.json", JSON.stringify(bans, null, 4), err => {
                if (err) throw err;
            });
            await bot.utils.warning(bot, message.guild.id, target.id, message.author.id, `**Ban:** ${reason}`, 10, (err, result) => {
                if (err) {
                    console.log(err);
                    return message.channel.send(`Oops! I didn't manage to correctly log this.`);
                }
                else {
                    // notify channel
                    message.channel.send(`${target.user.username} has been banned for ${banPeriod} ${clock}${s}.`);
                    // notify logchannel
                    var timeString = `\n**Time:** ${banPeriod} ${clock}${s}`
                    bot.utils.logChannel(bot, message.guild.id, `Member banned!`, target.user, message.author, reason, timeString, `\n**Warn ID:** ${result}`);
                }
            })
            //notify console
            console.log(`${target.user.username} has been banned for ${banPeriod} ${clock}${s}.`);
        }

        else {
            var reason = args.splice(1).join(' ')
            //notify user
            target.send(`**You have been banned for the following reason:** ${reason}`)
                .catch(console.error);
            //ban.
            target.ban(`Moderator: ${message.author.username}; Reason: ${reason}`)
            await bot.utils.warning(bot, message.guild.id, target.id, message.author.id, `**Ban:** ${reason}`, 10, (err, result) => {
                if (err) {
                    console.log(err);
                    return message.channel.send(`Oops! I didn't manage to correctly log this.`);
                }
                else {
                    // notify channel
                    message.channel.send(`${target.user.username} has been banned`);
                    // notify logchannel
                    bot.utils.logChannel(bot, message.guild.id, `Member banned!`, target.user, message.author, reason, '', `\n**Warn ID:** ${result}`);
                }
            })
            //notify console
            console.log(`${target.user.username} has been banned.`);
        }
    }
    return;
}

module.exports.help = {
    name: "ban",
    usage: "ban <username> <reason>",
    type: "Moderation",
    description: "bans the specified user, with an optional reason."
}