const Discord = require('discord.js');
const guilds = require("../data/guilds.json");
const sqlite3 = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    //import logChannel.
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
    
    var db = await new sqlite3.Database('./data/data.db', (err) => {
        if (err) return console.error(err.message);
        else console.log('Connected to the SQLite users database.');
    })
    let sql = `SELECT warn_id,
                      guild_id, 
                      user_id, 
                      moderator_id, 
                      warn_str, 
                      severity, 
                      date 
               FROM warnings
               ORDER BY user_id, warn_id`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows)
        console.log(rows[0].warn_id)
        try {
            logChannel.send({
                embed: new Discord.RichEmbed()
                    .setTitle(`List of all warnings`)
                    .setTimestamp()
            })
        }
        catch (error) {
            if (!guildID) return console.log(`ERR: No guildID given!`)
            if (!logChannel) return console.log(`ERR: No logchannel defined for this guild!`)
            else console.log(error)
        }
        if (message.channel.id === guilds[message.guild.id].adminbotChannelID) {
            if (!args[0]) {
                
            }
            else if (args[0] == 'config') {
                if (!args[1]) {
                    let message = bot.utils.randomSelection([
                        `Please supply a user id to configure`,
                        `Config what??`,
                        `You didn't supply a user id...`
                    ]);
                    message.channel.send(message);
                    return;
                }
                else if (isNaN(args[1])) {
                    let message = bot.utils.randomSelection([
                        `Please supply a user id to configure`,
                        `That doesn't look like a user id. To get the user id it can either be found in the list of all warnings, or via enabling developer tools and right clicking the target user's username and pressing "copy id".`,
                        `You didn't supply a user id...`
                    ]);
                    message.channel.send(message);
                    return;
                }
                let target = message.channel.guild.members.get(args[1])
                if (!target) {
                    message.channel.send(`The stated user is not a member of this guild...`)
                }
                else if (args[2] == 'severity') {
    
                }
                else if (args[2] == 'message') {
    
                }
                //this needs to be changed to accomodate a warning id...
                else {
                    let message = bot.utils.randomSelection([
                        "Please select between `severity` or `message` to configure for this user.",
                        "Are you configuring `severity` or `message` for this warning?"
                    ]);
                    message.channel.send(message);
                    return;
                }
            }
            else if (!isNaN(args[0])) {
                //show warns for this user
            }
    
        }
    })
    db.close((err) => {
        if (err) return console.error(err.message);
        else console.log('Closed database connection.');
    });
}

module.exports.help = {
    name: "warns",
    usage: "warn [<config>] [<user>]",
    type: "Moderation",
    description: "Allows the viewing"
}