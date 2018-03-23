const Discord = require('discord.js');
const guilds = require("./data/guilds.json");

exports.logChannel = (bot, guildID, event, user, moderator, reason, timeString, other, thumbnail) => {
    // Takes the arguments as above. timeString and other must be formatted already.
    if (!guildID) return console.log(`guildID is not defined!`);
    // identify the logger channel
    let logChannel = (bot.guilds.get(guildID)).channels.get(guilds[guildID].logChannelID)
    // check if other supplied
    if (!other || other == '') { var other = '' }    // check for a user parameter
    if (user) { 
        var userString = `**Target:** ${user} (${user.tag})`
        var user_id = `ID: ${user.id}`
        var icon = user.displayAvatarURL
    }
    if (!user || user == '') { 
        var userString = ''
        var user_id = ''
    }
    // check if there is a moderator parameter
    if (moderator) { 
        var moderatorString = `\n**Moderator:** ${moderator} (${moderator.tag})` 
        if (!user) { var icon = moderator.user.displayAvatarURL }
    }
    if (!moderator || moderator == '') { 
        var moderatorString = '' 
        if (!user) { var icon = bot.displayAvatarURL }
    }
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
                .setDescription(`${userString}${moderatorString}${reasonString}${timeString}${other}`)
                .setFooter(user_id)
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

exports.warning = async (bot, guildID, userID, moderatorID, string, severity, callback) => {
    // create warnings table if it doesn't exist
    function createtable(cb) {
        let sql = `CREATE TABLE IF NOT EXISTS warns (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
            guild_id VARCHAR(30), 
            user_id VARCHAR(30), 
            moderator_id VARCHAR(30), 
            warn_str TINYTEXT, 
            severity INT, 
            date VARCHAR(30)
            )`
        bot.db.query(sql, (err, result) => {
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
        bot.db.query(
            `INSERT INTO warns (guild_id, user_id, moderator_id, warn_str, severity, date) VALUES(?,?,?,?,?,?)`, 
            [guildID, userID, moderatorID, string, severity, Date.now()], 
            (err, result) => {
            if (err) {
                cb(err.message, null)
            }
            else {
                console.log(`Warning insertion successful. Warning ID: ${result.insertId}`);
                cb(null, result.insertId)
            }
        })
    }
    createtable((err) => {
        if (err) return console.log(err);
        insertwarning(guildID, userID, moderatorID, string, severity, (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }
            callback(null, result)
        })
    })
}