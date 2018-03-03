// const bot = require('./bot');
const Discord = require('discord.js');
const guilds = require("./data/guilds.json");
const sqlite3 = require('sqlite3').verbose();

exports.logChannel = (bot, guildID, event, user, moderator, reason, timeString, other, thumbnail) => {
    if (!guildID) return console.log(`guildID is not defined!`);
    // identify the logger channel
    let logChannel = (bot.guilds.get(guildID)).channels.get(guilds[guildID].logChannelID)
    // check if there is a moderator parameter
    if (moderator) { var moderatorString = `\n**Moderator:** ${moderator} (${moderator.tag})` }
    if (!moderator || moderator == '') { var moderatorString = '' }
    // check for reason
    if (reason) { var reasonString = `\n**Reason:** ${reason}` }
    if (!reason || reason == '') { var reasonString = '' }
    // check for timeString
    if (!timeString || timeString == '') { var timeString = '' }
    // check if other supplied
    if (!other || other == '') { var other = '' }
    // do the actual embed
    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setDescription(`**Target:** ${user} (${user.tag})${moderatorString}${reasonString}${timeString}${other}`)
                .setFooter(`ID: ${user.id}`)
                .setAuthor(event, user.displayAvatarURL)
                .setTimestamp()
                .setThumbnail(thumbnail)
        })
    }
    catch (error) {
        if (!guildID) return console.log(`LoggerERR: No guildID given!`)
        if (!logChannel) return console.log(`LoggerERR: No logchannel defined for this guild!`)
        else console.log(error)
    }
}
exports.randomSelection = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
}
exports.warning = async (bot, guildID, userID, moderatorID, string, severity) => {
    // create warnings table if it doesn't exist
    function createtable(cb) {
        db.run('CREATE TABLE IF NOT EXISTS warnings (warn_id integer PRIMARY KEY, guild_id text, user_id text, moderator_id text, warn_str text, severity integer, date integer)', 
        function (err) {
            if (err) {
                cb(err.message)
            }
            else {
                console.log(`Warnings table opened/created successfully.`);
                cb(null)
            }
        })
    }
    // perform the insertion
    function insertwarning(guildID, userID, moderatorID, string, severity, cb) {
        db.run(
            "INSERT INTO warnings (guild_id, user_id, moderator_id, warn_str, severity, date) VALUES(?,?,?,?,?,?)", 
            [guildID, userID, moderatorID, string, severity, Date.now()], 
            function (err) {
            if (err) {
                cb(err.message)
            }
            else {
                console.log(`Warning insertion successful. Warning ID: ${this.lastID}`);
                cb(null)
            }
        })
    }
    // open database connection
    var db = await new sqlite3.Database('./data/data.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        else {
            console.log('Connected to data.db');
            createtable(function(err) {
                if (err) return console.log(err);
                insertwarning(guildID, userID, moderatorID, string, severity, function(err) {
                    if (err) {
                        console.log(err);
                        return
                    }
                })
            })
        }
    })
    await db.close((err) => {
        if (err) {
            return console.error(err.message)
        }
        console.log('Closed database connection.');
    });
}