const Discord = require('discord.js');
const guilds = require("../data/guilds.json");

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    console.log("warning...");
    // can this user ban members?
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to warn without sufficient permissions!`);
    // Get the mentioned member object
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    // No member specified?
    if (!target) {
        console.log(`${message.author.username} failed to specify a target user!`);
        (await message.channel.send(`Please specify a target user.`)).delete(5000);
        return;
    }
    // no warning string specified?
    if (!args[1]) {
        console.log(`${message.author.username} failed to specify a warning string!`);
        // Random error messages. This is gunna be great.
        let response = bot.utils.randomSelection([
            `What.. what did they do? I can't just figure that out by myself you know...`,
            `Please specify a warning.`,
            `Hey I'm a busy bot, you ask me to add a warn and not tell me why?`,
            `What did they do?`,
            `And why am I supposed to warn them?`,
            `There is no warning message.. What am I supposed to do with this?`,
            `Please tell me the warning message...`,
            `Please specify a warning message...`,
            `You forgot to specify a warning message.`
        ]);
        (await message.channel.send(response)).delete(10000);
        return;
    }

    // BEGIN

    if (isNaN(args[1])) {
        var severity = 1
        var warningString = args.splice(1).join(' ')
    }
    else if (!args[2]) {
        console.log(`${message.author.username} failed to specify a warning.`);
        let response = bot.utils.randomSelection([
            `What did they do? I can't just figure that out by myself you know...`,
            `Please specify a warning.`,
            `Hey I'm a busy bot, you ask me to add a warn and not tell me why?`,
            `What did they do?`,
            `And why am I supposed to warn them?`,
            `There is no warning message.. What am I supposed to do with this?`,
            `Please tell me the warning message...`,
            `Please specify a warning message...`,
            `You forgot to specify a warning message.`,
            `What am I meant to do with just a number?`
        ]);
        (await message.channel.send(response)).delete(10000);
        return;
    }
    else if (args[1] < 0) {
        console.log(`Invalid severity`)
        let response = bot.utils.randomSelection([
            `That's a bit... not right... Can you supply a *valid* severity value please? Like... from 1 to 10... thanks.`,
            `That's an invalid severity right there! 1 to 10 please. Only. kthxbai`,
            `You do realise that the first parameter of this is meant to be a severity value right? like from 1 to 10.. not ${args[1]}`,
            `Can you keep it to a reasonable number please? Like from 1 to 10? Thank you...`,
            `How am I meant to work with a negative number for the severity?`,
            `Pretty sure that's a negative number you just set the severity at. I don't think that works... :joy:`,
            `That's meant to be a severity value right?`                
        ]);
        (await message.channel.send(response)).delete(10000);
        return;
    }
    else if (args[1] > 10) {
        console.log(`Invalid severity`)
        let response = bot.utils.randomSelection([
            `That's a bit... not right... Can you supply a *valid* severity value please? Like... from 1 to 10... thanks.`,
            `That's an invalid severity right there! 1 to 10 please. Only. kthxbai`,
            `You do realise that the first parameter of this is meant to be a severity value right? like from 1 to 10.. not ${args[1]}`,
            `Can you keep it to a reasonable number please? Like from 1 to 10? Thank you...`,
            `That's meant to be a severity value right?`,
            `That's a bit too big for a severity value.. Just a bit.`,
            `... That's a bit too big for me... That severity value.. Mind making it smaller? Please? Thanks... :sweat_smile:`
        ]);
        (await message.channel.send(response)).delete(10000);
        return;
    };
    if (!isNaN(args[1])) {
        var severity = args[1];
        var warningString = args.splice(2).join(' ')
    };
    let userID = target.id
    let moderator = message.author
    let guildID = message.guild.id

    await target.send(`**You have received a warning!**\n${warningString}`)
        .catch(console.error);
    await bot.utils.warning(bot, guildID, userID, moderator.id, warningString, severity, (err, result) => {
        if (err) {
            console.log(err);
            return message.channel.send(`Oops! Something didn't quite go right...`);
        }
        else {
            message.channel.send(`${target.user.username} has been warned!`);
            bot.utils.logChannel(bot, guildID, `Member warned!`, target.user, moderator, '', '', `\n**Severity:** ${severity}\n**Warning:** ${warningString}\n**Warn ID:** ${result}`);
        }
    })
}

module.exports.help = {
    name: "warn",
    usage: "warn <user> <severity> <warning>",
    type: "Moderation",
    description: "Adds a warning attached to the user to the database."
}

