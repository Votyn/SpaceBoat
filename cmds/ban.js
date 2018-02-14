const fs = module.require("fs");
const Discord = require("discord.js");
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json")
const bans = module.require("../configs/bans.json");

module.exports.run = async (client, message, args) => {
    console.log("banning...");
    //load logChannel
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    //can this user ban members?
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to kick without sufficient permissions!`);
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

    // There are no arguments after the target user is identified
    if (!args[1]) {
        //notify logchannel.
        var timeLog = ''
        var reasonLog = ''
        //notify channel
        message.channel.send(`${target.user.username} has been banned!`).then(m => m.delete(20000));
        //notify console.
        console.log(`${target.user.username} has been banned!`);
        //ban the target user.
        message.reply('oh er meh no')
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

            //if no clock supplied, or invalid clock, default to clock of hour.
            if (!args[2] || !clock) {
                var clock = 'hour';
                var multiplier = 1;
                var reason = args.splice(2).join(' ')
            }

            let s = 's'
            if (banPeriod == 1) { s = '' }

            if (reason) {
                target.send(`**You have been banned for __${banPeriod} ${clock}${s}__ with the following reason:** ${reason}`)
                    .catch(console.error);
                var reasonLog = '\n**Reason:** ' + reason
                //ban the target user    
            }
            if (!reason) {
                var reasonLog = ''
                target.send(`**You have been banned for __${banPeriod} ${clock}${s}__**`)
                    .catch(console.error);
                //ban the target user
                await message.reply('ok.. maybe later. not up to it atm..')
            }
            //since it's a timed ban, create a json entry and write to bans.json
            bans[target.id] = {
                guild: message.guild.id,
                time: Date.now() + banPeriod * multiplier * 3600000
            }
            fs.writeFileSync("./configs/bans.json", JSON.stringify(bans, null, 4), err => {
                if (err) throw err;
            });
            //notify logchannel.
            var timeLog = `\n**Time:** ${banPeriod} ${clock}${s}`
            //notify console
            console.log(`${target.user.username} has been banned for ${banPeriod} ${clock}${s}.`);
            //notifychannel.
            (await message.channel.send(`${target.user.username} has been banned for ${banPeriod} ${clock}${s}.`)).delete(20000);
        }

        else {
            //notify log
            var reason = args.splice(1).join(' ')
            var reasonLog = `\n**Reason:** ${reason}`
            var timeLog = ''
            //notify user
            target.send(`**You have been banned for the following reason:** ${reason}`)
                .catch(console.error);
            //ban.
            message.reply(`meh maybe later.`)
            //notify console
            console.log(`${target.user.username} has been banned.`);
            //notifychannel.
            (await message.channel.send(`${target.user.username} has been banned.`)).delete(20000);
        }
    }

    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setDescription(`**Target:** ${target}\n**Moderator:** ${message.author}${timeLog}${reasonLog}`)
                .setFooter(`ID: ${target.id}`)
                .setAuthor(`Member Banned!`, target.user.displayAvatarURL)
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
    name: "ban",
    usage: "ban <username> <reason>",
    description: "bans the specified user, with an optional reason."
}