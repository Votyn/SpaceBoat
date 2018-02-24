// const bot = require('./bot');
const Discord = require('discord.js');
const guilds = require("./configs/guilds.json");
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

// stolen from RayzrDev SharpBot
exports.randomSelection = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
}

exports.warning = async (bot, guildID, userID, moderatorID, string, severity) => {
    // open database connection
    let db = await new sqlite3.Database('./data/data.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        console.log('Connected to the SQLite users database.');
    })
    // create warnings table if it doesn't exist
    console.log(`Creating table...`)
    await db.run('CREATE TABLE IF NOT EXISTS warnings (guild_id integer, user_id integer, moderator_id integer, warn_str text, severity integer, date integer)', function(err) {
        if (err) return console.error(err.message);
        else console.log(`Table created successfully.`);
    })
    // perform the insertion
    await db.run(`INSERT INTO warnings (guild_id, user_id, moderator_id, warn_str, severity, date) VALUES(?,?,?,?,?,?)`, [guildID, userID, moderatorID, string, severity, Date.now()], function(err) {
        if (err) return console.error(err.message);
        else console.log(`Successfully inserted warning into SQLite table, with rowid ${this.lastID}`);
    });
    await db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Closed database connection.');
      });
}