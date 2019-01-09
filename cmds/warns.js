const Discord = require('discord.js');
const guilds = require("../data/guilds.json");
const sqlite3 = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    //import logChannel.
    const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);
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

    let sql_warnid = `SELECT warn_id
                      FROM warnings
                      WHERE warn_id = ?`;

    function getusers() {
        return new Promise((resolve, reject) => {
            db.all(sql_users, [message.guild.id], (err, rows) => {
                if (err) return reject(err);
                else {
                    resolve(rows);
                }
            });
        });
    }

    let users = await getusers().catch(err => console.log(err))

    function getwarns(userid) {
        return new Promise((resolve, reject) => {
            db.all(sql_warn, [userid], (err, rows) => {
                if (err) reject(err);
                else {
                    resolve(rows);
                }
            });
        })
    }

    function checkwarnid(warnid) {
        return new Promise((resolve, reject) => {
            db.all(sql_warnid, [warnid], (err, row) => {
                if (err) reject(err);
                else {
                    resolve(row);
                }
            });
        });
    }

    function gettally(warns) {
        let severities = []
        warns.forEach(warn => { severities.push(warn.severity) });
        let tally = severities.reduce((a, b) => { return a + b; }, 0);
        return tally;
    }

    if (message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        if (!args[0]) { // Sends an embed with a summarized report for all warned users in a guild.
            let embed = new Discord.RichEmbed({ title: "List of warned users", description: "_ _" }).setColor(bot.colour)
            for (let user of users) {
                let warns = await getwarns(user.user_id).catch(err => console.log(err))
                let previouswarn = warns.slice(-1)[0]
                let date = new Date(previouswarn.date)
                date = date.toDateString()
                let target
                try { target = (message.guild.members.get(user.user_id)).user.tag }
                catch (error) { console.log(error.message) }
                finally { if (!target) { target = user.user_id } }
                embed.addField(target, `**Warn Severity Tally:** ${gettally(warns)}\n**Most Recent Warning:** (id: ${previouswarn.warn_id})\n**Severity:** ${previouswarn.severity}\n**Warning:** "${previouswarn.warn_str}"\n**Mod:** ${message.guild.members.get(previouswarn.moderator_id)}\n**Date:** ${date}\n_ _`, true)
            }
            message.channel.send({ embed })
        }
        else if (args[0] == 'full') { // Sends an embed with all warnings for each warned user in the guild.
            for (let user of users) {
                let warns = await getwarns(user.user_id).catch(err => console.log(err))
                var embed = new Discord.RichEmbed().setColor(bot.colour)
                let target
                try { target = message.guild.members.get(user.user_id) }
                catch (error) { console.log(error.message) }
                finally {
                    if (!target) { embed.setAuthor(user.user_id) }
                    else { embed.setAuthor(target.user.username, target.user.displayAvatarURL) }
                }
                embed.setDescription(`Warning Severity Tally: ${gettally(warns)}`);
                for (let warn of warns) {
                    let date = (new Date(warn.date)).toDateString()
                    embed.addField(`**Warn ID:** ${warn.warn_id}`, `\n**Severity:** ${warn.severity}\n**Mod:** ${message.guild.members.get(warn.moderator_id)}\n**Warning:** "${warn.warn_str}"\n**Date:** ${date}\n`, true)
                }
                message.channel.send({ embed })
            }
        }
        else if (args[0] == 'config') {
            if (args[1] == 'severity') {
                let warn = await checkwarnid(args[2])
                if (warn == []) {
                    let response = bot.utils.randomSelection([
                        `Which warn id do you want me to configure?`,
                        `That's not a valid warn id...`,
                        `Please can you state which warn id you want configured?`
                    ]);
                    return message.channel.send(response);
                }
                else {
                    if (args[3] && !isNaN(args[3]) && args[3] > 0 && args[3] < 11) {
                        db.run(`UPDATE warnings
                                SET severity = ?
                                WHERE warn_id = ?`,
                            [args[3], args[2]], err => { if (err) console.log(err) })
                        return message.channel.send(`Severity updated!`);
                    }
                    else {
                        let response = bot.utils.randomSelection([
                            `That isn't a valid severity value.`,
                            `Can you make sure that severity value is a number between 1 and 10 please?`
                        ]);
                        return message.channel.send(response);
                    }
                }
            }
            else if (args[1] == 'warning') {
                let warn = await checkwarnid(args[2])
                if (warn == []) {
                    let response = bot.utils.randomSelection([
                        `Which warn id do you want me to configure?`,
                        `That's not a valid warn id...`,
                        `Please can you state which warn id you want configured?`
                    ]);
                    return message.channel.send(response);
                }
                else {
                    if (args[2] == `warning`) {
                        if (args[3]) {
                            db.run(`UPDATE warnings
                                    SET warn_str = ?
                                    WHERE warn_id = ?`,
                                [args[3], `${args[1]}`], err => { if (err) console.log(err) })
                            return message.channel.send(`Warning text updated!`);
                        }
                        else {
                            let response = bot.utils.randomSelection([
                                `Please can you supply a warning string?`,
                                `Please input what you want to change the warning to.`
                            ]);
                            return message.channel.send(response);
                        }
                    }
                }
            }
            let warn = await checkwarnid(args[1])
            if (warn != []) {
                if (args[2] == `severity`) {
                    if (args[3] && !isNaN(args[3]) && args[3] > 0 && args[3] < 11) {
                        db.run(`UPDATE warnings
                                SET severity = ?
                                WHERE warn_id = ?`,
                            [args[3], args[1]], err => { if (err) console.log(err) })
                        return message.channel.send(`Severity updated!`);
                    }
                    else {
                        let response = bot.utils.randomSelection([
                            `That isn't a valid severity value.`,
                            `Can you make sure that severity value is a number between 1 and 10 please?`
                        ]);
                        return message.channel.send(response);
                    }
                }
                else if (args[2] == `warning`) {
                    if (args[3]) {
                        db.run(`UPDATE warnings
                                SET warn_str = ?
                                WHERE warn_id = ?`,
                            [args[3], `${args[1]}`], err => { if (err) console.log(err) })
                        return message.channel.send(`Warning text updated!`);
                    }
                    else {
                        let response = bot.utils.randomSelection([
                            `Please can you supply a warning string?`,
                            `Please input what you want to change the warning to.`
                        ]);
                        return message.channel.send(response);
                    }
                }
                else {
                    let response = bot.utils.randomSelection([
                        `That's not a valid configuration parameter`,
                        "Please can you state whether you want to configure the `severity` or the `warning` text of the warning?"
                    ]);
                    return message.channel.send(response);
                }
            }
            else {
                let response = bot.utils.randomSelection([
                    `Errrr I don't know what to do with this...`,
                    `Erm... Not sure how to handle this...`,
                    `That's not really how this command is meant to be used...`,
                    `Please can you include the warning id what you want to change and what parameter (severity or warning text) you want to change.`
                ]);
                return message.channel.send(response);
            }
        }
        else if (args[0] == `remove` || args[0] == `delete` || args[0] == `del` || args[0] == `rm`) {
            let warn = await checkwarnid(args[1])
            if (warn == []) {
                let response = bot.utils.randomSelection([
                    `Which warn id do you want me to remove?`,
                    `That's not a valid warn id...`,
                    `Please can you state which warn id you want removed?`
                ]);
                return message.channel.send(response);
            }
            else {
                await db.run(`DELETE FROM warnings WHERE warn_id = ?`, args[1], err => { if (err) console.log(err) });
                let response = bot.utils.randomSelection([
                    `Done and dusted! :D`,
                    `Warning removed.`,
                    `Done. :)`
                ]);
                return message.channel.send(response);
            }
        }
        else {
            let target = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned member
            if (target) {
                let warns = await getwarns(target.id).catch(err => console.log(err))
                var embed = new Discord.RichEmbed().setAuthor(target.user.username, target.user.displayAvatarURL).setColor(bot.colour)
                embed.setDescription(`Warning Severity Tally: ${gettally(warns)}`);
                for (let warn of warns) {
                    let date = (new Date(warn.date)).toDateString()
                    embed.addField(`**Warn ID:** ${warn.warn_id}`, `\n**Severity:** ${warn.severity}\n**Mod:** ${message.guild.members.get(warn.moderator_id)}\n**Warning:** "${warn.warn_str}"\n**Date:** ${date}\n`, true)
                }
                message.channel.send({ embed })
            }
            else {
                let warns = await getwarns(args[0]).catch(err => console.log(err))
                if (warns != []) {
                    var embed = new Discord.RichEmbed().setAuthor(args[0]).setColor(bot.colour)
                    embed.setDescription(`Warning Severity Tally: ${gettally(warns)}`);
                    for (let warn of warns) {
                        let date = (new Date(warn.date)).toDateString()
                        embed.addField(`**Warn ID:** ${warn.warn_id}`, `\n**Severity:** ${warn.severity}\n**Mod:** ${message.guild.members.get(warn.moderator_id)}\n**Warning:** "${warn.warn_str}"\n**Date:** ${date}\n`, true)
                    }
                    message.channel.send({ embed })
                }
            }
        }

    }
}

module.exports.help = {
    name: "warns",
    usage: "warn [<config>] [<user>]",
    type: "Moderation",
    description: "Allows the viewing"
}