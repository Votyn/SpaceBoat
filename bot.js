const Discord = module.require("discord.js");
const fs = module.require("fs");
const sqlite3 = require('sqlite3').verbose();
const config = require("./data/config.json");
try {
    var mutes = require("./data/config.json");
}
catch (error) {
    console.log(`${message.error}\nPlease edit the config-example.json file, and rename it as config.json!`)
}
try {
    var mutes = require("./data/mutes.json");
}
catch (error) {
    console.log(`${error.message}`);
    fs.writeFileSync("./data/mutes.json", JSON.stringify({}, null, 4), err => {
        if (err) console.error('Error creating mutes.json file:', err);
    });
    var mutes = require("./data/mutes.json");
    console.log(`Creating new mutes.json file.`);
}
try {
    var bans = require("./data/bans.json");
}
catch (error) {
    console.log(`${error.message}`);
    fs.writeFileSync("./data/bans.json", JSON.stringify({}, null, 4), err => {
        if (err) console.error('Error creating bans.json file:', err);
    });
    var bans = require("./data/bans.json");
    console.log(`Creating new bans.json file.`);
}

try {
    var guilds = require("./data/guilds.json");
}
catch (error) {
    console.log(`${error.message}\nCreating new guilds.json file.`);
    fs.writeFileSync("./data/guilds.json", JSON.stringify({}, null, 4), err => {
        if (err) console.error('Error saving guilds.json file:', err);
    });
    var guilds = require("./data/guilds.json");
}

const bot = new Discord.Client();

bot.utils = global.utils = require('./utils');

bot.commands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js")
    if (jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`)
        console.log(`${i + 1}: ${f} loaded!`)
        bot.commands.set(props.help.name, props);
    });
});

bot.on('ready', () => {
    console.log(`${bot.user.username} switched on.`);

    let botGuildsIDs = Array.from(bot.guilds.keys());
    for (let i in botGuildsIDs) {
        if (!guilds.hasOwnProperty(botGuildsIDs[i])) {
            console.log(`Setting up ${botGuildsIDs[i]}`);
            guilds[botGuildsIDs[i]] = {
                logChannelID: "",
                botChannelID: "",
                adminbotChannelID: ""
            }
            fs.writeFile("./data/guilds.json", JSON.stringify(guilds, null, 4), err => {
                if (err) console.error('Error saving guilds.json file:', err);
            });
            console.log("Guild added to guilds.json. Please configure channelIDs.");
        }
    }

    for (let i in guilds) {
        let guild = bot.guilds.get(i)
        if (!guild) {
            console.log(`Error: Guild not found! Removing from records...`);
            guilds[i] = null;
            delete guilds[i];
            fs.writeFile("./data/guilds.json", JSON.stringify(guilds, null, 4), err => {
                if (err) console.error('Error saving guilds.json file: ', err);
            });
            console.log(`Removed successfully!`);
            continue;
        }
        if (!guilds[i].logChannelID) {
            console.log(`ERROR: Server [${guild.name}] does not have a logging channel!`)
        }
        if (!guilds[i].botChannelID) {
            console.log(`ERROR: Server [${guild.name}] does not have a specified bot channel!`)
        }
        if (!guilds[i].adminbotChannelID) {
            console.log(`ERROR: Server [${guild.name}] does not have an admin bot channel!`)
        }
        console.log(`Server [${guild.name}] loaded with ${guild.channels.size} channels and ${guild.memberCount} members.`);
    }
    if (mutes) {
        bot.setInterval(() => {
            for (let i in mutes) {
                let time = mutes[i].time;
                let guildID = mutes[i].guild;
                let guild = bot.guilds.get(guildID);
                let member = guild.members.get(i);
                let mutedRole = guild.roles.find(r => r.name === "Muted");
                // check if member is still in server
                if (!member) {
                    console.log('ERROR: User is not in the server anymore!');
                    delete mutes[i];
                    fs.writeFileSync("./data/mutes.json", JSON.stringify(mutes, null, 4), err => {
                        if (err) console.error('Error saving mutes.json file: ', err);
                    });
                    continue;
                }
                // check if the member has the muted role.
                if (!member.roles.has(mutedRole.id)) {
                    console.log('User has been manually unmuted!');
                    delete mutes[i];
                    fs.writeFileSync("./data/mutes.json", JSON.stringify(mutes, null, 4), err => {
                        if (err) console.error('Error saving mutes.json file: ', err);
                    });
                    let logChannel = guild.channels.get(guilds[guildID].logChannelID)
                    try {
                        logChannel.send({
                            embed: new Discord.RichEmbed()
                                .setDescription(`${member} was unmuted manually before the end of term.`)
                                .setFooter(`ID: ${member.id}`)
                                .setAuthor(`Member was unmuted.`, member.user.displayAvatarURL)
                                .setTimestamp()
                        })
                    }
                    catch (error) {
                        if (!logChannel) console.log('No logchannel defined for this guild!');
                        else console.log(error);
                    }
                    continue;
                }
                // automatic unmute
                if (Date.now() > time) {
                    // unmute
                    member.removeRole(mutedRole);
                    // notify console
                    console.log(`${member.user.username} has been unmuted.`);
                    // notify logchannel
                    let logChannel = guild.channels.get(guilds[guildID].logChannelID)
                    bot.utils.logChannel(bot, guildID, `Member unmuted.`, member.user, bot.user, `Automatic.`)
                    //remove the entry
                    mutes[i] = null;
                    delete mutes[i];
                    fs.writeFileSync("./data/mutes.json", JSON.stringify(mutes, null, 4), err => {
                        if (err) console.error('Error saving mutes.json file:', err);
                    });
                }
            }
        });
    }
    if (bans) {
        bot.setInterval(() => {
            for (let j in bans) {
                let time = bans[j].time;
                let guildID = bans[j].guild;
                let guild = bot.guilds.get(guildID);
                guild.fetchBans()
                    .then(Collection => {
                        let user = Collection.get(j)
                        if (Date.now() > time) {
                            if (user) {
                                guild.unban(user, `Automatic: Tempban term ended.`)
                                try {
                                    delete bans[j];
                                    fs.writeFile("./data/bans.json", JSON.stringify(bans, null, 4), err => {
                                        if (err) console.error('Error saving bans.json file:', err);
                                    });
                                }
                                catch (error) { console.log(error) }
                                let logChannel = guild.channels.get(guilds[guildID].logChannelID)
                                console.log(`${user.username} has been unbanned.`);
                                bot.utils.logChannel(bot, guildID, `Member unbanned.`, user, bot.user, `Automatically unbanned - Temporary ban term ended.`)
                            }
                            else {
                                console.log(`User ${j} not found!`)
                                try {
                                    guild.channels.get(guilds[guildID].logChannelID).send({
                                        embed: new Discord.RichEmbed()
                                            .setDescription(`${user.username} was unbanned manually before the end of term.`)
                                            .setFooter(`ID: ${member.id}`)
                                            .setAuthor(`Member was unbanned.`, member.user.displayAvatarURL)
                                            .setTimestamp()
                                    })
                                }
                                catch (error) {
                                    // if (!logChannel) console.log('No logchannel defined for this guild!');
                                    console.log(error);
                                };
                                try {
                                    delete bans[j];
                                    fs.writeFile("./data/bans.json", JSON.stringify(bans, null, 4), err => {
                                        if (err) console.error('Error saving bans.json file:', err);
                                    });
                                }
                                catch (error) { console.log(error) }
                            }
                            return;
                        }
                        return;
                    })
                    .catch(error => { console.log(error) });
                continue;
            }
        }, 30000);
    }
});

bot.db = global.db = new sqlite3.Database('./data/data.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    else console.log(`Connected to Database.`);
})

bot.on('message', message => {
    if (message.author.bot) return;
    if (message.mentions.everyone) {
        bot.utils.logChannel(bot, message.guild.id, 'PINGED.', message.author, '', `sent message: "${message}"`, '')
    }
    if (!(message.channel.type === "text")) return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(config.prefix)) return;

    let cmd = bot.commands.get(command.slice(config.prefix.length));
    if (cmd) cmd.run(bot, message, args);
});

bot.on('guildMemberAdd', member => {
    let logChannel = member.guild.channels.get(guilds[member.guild.id].logChannelID)
    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setThumbnail(member.user.displayAvatarURL)
                .setDescription(`${member} - ${member.user.tag}`)
                .setFooter(`ID: ${member.id}`)
                .setAuthor(`Member joined!`, member.user.displayAvatarURL)
                .setTimestamp()
        });
    }
    catch (error) {
        if (!logChannel) console.log('No logchannel defined for this guild!');
        else console.log(error);
    }
    console.log(`Member joined! ${member.user.tag}`);
});

//below is repeat-logged when member kicked/banned. Must fix when warnings introduced.

bot.on('guildMemberRemove', member => {
    let logChannel = member.guild.channels.get(guilds[member.guild.id].logChannelID)
    try {
        logChannel.send({
            embed: new Discord.RichEmbed()
                .setThumbnail(member.user.displayAvatarURL)
                .setDescription(`${member} - ${member.user.tag}`)
                .setFooter(`ID: ${member.id}`)
                .setAuthor(`Member left.`, member.user.displayAvatarURL)
                .setTimestamp()
        })
    }
    catch (error) {
        if (!logChannel) console.log('No logchannel defined for this guild!');
        else console.log(error);
    }
    console.log(`Member left! ${member.user.tag}`);
});

bot.on('guildCreate', guild => {
    guilds[guild.id] = {
        logChannelID: "",
        botChannelID: "",
        adminbotChannelID: ""
    }
    fs.writeFile("./data/guilds.json", JSON.stringify(guilds, null, 4), err => {
        if (err) console.error('Error saving guilds.json file:', err);
    });
    console.log(`Joined new server! Please set up Channel IDs.`)
});

bot.on('messageDelete', message => {
    if (!message.guild || !message.guild.channels || (!message.cleanContent && !message.attachments.first())) {
        return;
    };

    let channel = message.guild.channels.find(c => c.name === "adminlog");
    if (!channel) return;

    let embed = new Discord.RichEmbed()
                .setTitle('Message Deleted!')
                .setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1950)}\n\`\`\``)
                .addField('Channel', `${message.channel}`)
                .setColor('red')
                .setTimestamp(new Date())
                .setFooter(`Author: @${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment.width) {
            embed.setImage(attachment.url);
        } else {
            embed.attachFile(attachment.url);
        }
        if (message.cleanContent) {
            embed.setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1950)}\n\`\`\`\n[File](${attachment.url})`)
        } else embed.setDescription(`[File](${attachment.url})`);
    } else if (message.cleanContent) embed.setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1750)}\n\`\`\``);

    channel.send({ embed });
});

bot.on('messageDeleteBulk', messages => {

    messages.tap(message => {
        if (!message.guild || !message.guild.channels || (!message.cleanContent && !message.attachments.first())) {
            return;
        };
        let channel = message.guild.channels.find(c => c.name === "adminlog");
        if (!channel) return;
    
        let embed = new Discord.RichEmbed()
                    .setTitle('Message Deleted! (in bulk)')
                    .setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1950)}\n\`\`\``)
                    .addField('Channel', `${message.channel}`)
                    .setColor('red')
                    .setTimestamp(new Date())
                    .setFooter(`Author: @${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
    
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.width) {
                embed.setImage(attachment.url);
            } else {
                embed.attachFile(attachment.url);
            }
            if (message.cleanContent) {
                embed.setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1950)}\n\`\`\`\n[File](${attachment.url})`)
            } else embed.setDescription(`[File](${attachment.url})`);
        } else if (message.cleanContent) embed.setDescription(`\`\`\`\n${(message.cleanContent).substr(0, 1750)}\n\`\`\``);

        channel.send({ embed });
    });    
});

// please fix: the below will activate even if user has been banned by bot. Will result in multiple logs.

// bot.on('guildBanAdd', guild, user => {
//     let logChannel = guild.channels.get(guilds[guild.id].logChannelID)
//     try {
//         logChannel.send({
//             embed: new Discord.RichEmbed()
//                 .setDescription(`**User:** ${user}\n`)
//                 .setFooter(`ID: ${target.id}`)
//                 .setAuthor(`Member Banned!`, target.user.displayAvatarURL)
//                 .setTimestamp()
//         })
//     }
//     catch (error) {
//         if (!logChannel) console.log('No logchannel defined for this guild!');
//         else console.log(error);
//     }
// });

//same for below.

// bot.on('guildBanRemove', guild, user => {
//     let logChannel = guild.channels.get(guilds[guild.id].logChannelID)
//     try {
//         logChannel.send({
//             embed: new Discord.RichEmbed()
//                 .setDescription(`**User:** ${user}\n*User was unbanned manually.*`)
//                 .setFooter(`ID: ${target.id}`)
//                 .setAuthor(`Member Unbanned.`, target.user.displayAvatarURL)
//                 .setTimestamp()
//         })
//     }
//     catch (error) {
//         if (!logChannel) console.log('No logchannel defined for this guild!');
//         else console.log(error);
//     }
// remove ban length from json
// });

bot.on('error', error => {
    console.log(`Bot has been disconnected with an error!\n${error}`)
});
bot.on('disconnect', event => {
    console.log(`Disconnected!\n${event.reason}`)
});
bot.on('destroy', () => {
    bot.db.close((err) => {
        if (err) return console.error(err.message);
        else console.log('Closed database connection.');
    });
})
bot.login(config.token)
    .then('Successful Login.')
    .catch(error => {
        console.log(`Login unsuccessful!\n${error}`)
    })

module.exports = bot;
