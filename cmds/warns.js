const Discord = require('discord.js');
const guilds = require("../data/guilds.json");
const sqlite3 = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    //import logChannel.
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);

    var db = await new sqlite3.Database('./data/data.db', (err) => {
        if (err) return console.error(err.message);
        else console.log('Connected to database.');
    })
    let sql = `SELECT warn_id,
                      guild_id, 
                      user_id, 
                      moderator_id, 
                      warn_str, 
                      severity, 
                      date 
               FROM warnings
               ORDER BY warn_id`;
    let sql_all = `SELECT warn_id,
                          guild_id, 
                          user_id, 
                          moderator_id, 
                          warn_str, 
                          severity, 
                          date 
                   FROM warnings
                   ORDER BY user_id, warn_id`;

    let sql_users = `SELECT DISTINCT user_id
                     FROM warnings
                     WHERE guild_id = ?
                     ORDER BY user_id`;

    let sql_warn = `SELECT warn_id,
                           moderator_id,
                           warn_str,
                           severity,
                           date
                    FROM warnings
                    WHERE user_id = ?
                    ORDER BY warn_id`;

    var embed = new Discord.RichEmbed().setTitle(`List of all warnings`);

    db.serialize(() => {
        var users = []
        db.each(sql_users, [message.guild.id], (err, row) => {
            if (err) throw err.message;
            else users.push(row.user_id);
            console.log(users)
        }, () => {
            users.forEach(userid => {
                let warns = []
                embed.addField(message.guild.members.get(userid))
                db.each(sql_warn, [userid], (err, row) => {
                    if (err) throw err.message;
                    else {
                        warns.push(row)
                        console.log(warns)
                    }
                });
                console.log(warns)
            })
        });
    })

    // getusers((err, userid) => {
    //     if (err) return console.log(err);
    //     console.log(userid)
    //     getwarns(userid, (err, rows) => {
    //         if (err) {
    //             console.log(err);
    //             return
    //         }
    //     })
    // })

    message.channel.send({ embed });
    // db.all(sql, [], (err, rows) => {
    //     if (err) {
    //         throw err;
    //     }
    //     return
    //     //don't forget to make sure that the guilds remain seperate...
    //     console.log(rows)
    //     console.log(rows[0].warn_id)
    //     let embed = new Discord.RichEmbed().setTitle(`List of all warnings`);
    //     Object.keys(rows).forEach(key => {
    //         let warn = rows[key]
    //         console.log(warn)
    //         let userID = warn[2]
    //         console.log(userID)
    //         console.log(message.guild.members.get(userID))
    //         let previous_warn = rows[key - 1]
    //         if (previous_warn && previous_warn.user_id === warn.user_id) {
    //             let field = `**Mod:** ${message.guild.members.get(`${warn.moderator_id}`)}\n**Severity:** ${warn.severity}\n**String:** "${warn.warn_str}"\n`
    //             embed.addField(`Warn ID: ${warn.warn_id}`, field, true)
    //         }
    //         else {
    //             let user = message.guild.members.get(`${warn.user_id}`)
    //             embed.addField(`member`, `Warning Tally: 2`)
    //             let field = `**Mod:** ${message.guild.members.get(`${warn.moderator_id}`)}\n**Severity:** ${warn.severity}\n**String:** "${warn.warn_str}"\n`
    //             embed.addField(`Warn ID: ${warn.warn_id}`, field, true)
    //         }
    //     });
    //     message.channel.send( {embed} )

    //     if (message.channel.id === guilds[message.guild.id].adminbotChannelID) {
    //         if (!args[0]) {

    //         }
    //         else if (args[0] == 'config') {
    //             if (!args[1]) {
    //                 let message = bot.utils.randomSelection([
    //                     `Please supply a user id to configure`,
    //                     `Config what??`,
    //                     `You didn't supply a user id...`
    //                 ]);
    //                 message.channel.send(message);
    //                 return;
    //             }
    //             else if (isNaN(args[1])) {
    //                 let message = bot.utils.randomSelection([
    //                     `Please supply a user id to configure`,
    //                     `That doesn't look like a user id. To get the user id it can either be found in the list of all warnings, or via enabling developer tools and right clicking the target user's username and pressing "copy id".`,
    //                     `You didn't supply a user id...`
    //                 ]);
    //                 message.channel.send(message);
    //                 return;
    //             }
    //             let target = message.channel.guild.members.get(args[1])
    //             if (!target) {
    //                 message.channel.send(`The stated user is not a member of this guild...`)
    //             }
    //             else if (args[2] == 'severity') {

    //             }
    //             else if (args[2] == 'message') {

    //             }
    //             //this needs to be changed to accomodate a warning id...
    //             else {
    //                 let message = bot.utils.randomSelection([
    //                     "Please select between `severity` or `message` to configure for this user.",
    //                     "Are you configuring `severity` or `message` for this warning?"
    //                 ]);
    //                 message.channel.send(message);
    //                 return;
    //             }
    //         }
    //         else if (!isNaN(args[0])) {
    //             //show warns for this user
    //         }

    //     }
    // })
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