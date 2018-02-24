const Discord = module.require("discord.js");
const fs = module.require("fs");
const config = require("./configs/config.json");
const mutes = require("./configs/mutes.json");
const bans = require("./configs/bans.json");

try {
        var guilds = require("./configs/guilds.json");
    }
catch (error) {
    console.log('ERROR: No guilds.json file found!');
    console.log("Creating new guilds.json file.");
    fs.writeFileSync("./configs/guilds.json", JSON.stringify({}, null, 4), err => {
        if (err) console.error('Error saving guilds.json file:', err);
    });
    var guilds = require("./configs/guilds.json");
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

    let botGuildsIDs = Array.from( bot.guilds.keys() );
    for (let i in botGuildsIDs) {
        if (!guilds.hasOwnProperty(botGuildsIDs[i])) {
            console.log(`Setting up ${botGuildsIDs[i]}`);
            guilds[botGuildsIDs[i]] = {
                logChannelID: "",
                botChannelID: "",
                adminbotChannelID: ""
            }
            fs.writeFile("./configs/guilds.json", JSON.stringify(guilds, null, 4), err => {
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
            fs.writeFile("./configs/guilds.json", JSON.stringify(guilds, null, 4), err => {
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

    bot.setInterval(() => {
            for ( let i in mutes) {
                let time = mutes[i].time;
                let guildID = mutes[i].guild;
                let guild = bot.guilds.get(guildID);
                let member = guild.members.get(i);
                let mutedRole = guild.roles.find(r => r.name === "Muted");
                // check if member is still in server
                if (!member) {
                    console.log('ERROR: User is not in the server anymore!'); 
                    delete mutes[i];
                    fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                        if (err) console.error('Error saving mutes.json file: ', err);
                    });
                    continue;
                }
                // check if the member has the muted role.
                if (!member.roles.has(mutedRole.id)) { 
                    console.log('User has been manually unmuted!'); 
                    delete mutes[i];
                    fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
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
                    fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                        if (err) console.error('Error saving mutes.json file:', err);
                    });
                }
            }
    });
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
                                fs.writeFile("./configs/bans.json", JSON.stringify(bans, null, 4), err => {
                                    if (err) console.error('Error saving bans.json file:', err);
                                });
                            }
                            catch(error) { console.log(error) }
                            let logChannel = guild.channels.get(guilds[guildID].logChannelID)
                            console.log(`${user.username} has been unbanned.`);
                            bot.utils.logChannel(bot, guildID, `Member unbanned.`, user, bot.user, `Automatically unbanned - Temporary ban term ended.`)
                        }
                        else {
                            console.log(`User ${j} not found!`)
                            try {
                                logChannel.send({
                                    embed: new Discord.RichEmbed()
                                        .setDescription(`${member} was unbanned manually before the end of term.`)
                                        .setFooter(`ID: ${member.id}`)
                                        .setAuthor(`Member was unbanned.`, member.user.displayAvatarURL)
                                        .setTimestamp()
                                })
                            }
                            catch (error) {
                                if (!logChannel) console.log('No logchannel defined for this guild!');
                                else console.log(error);
                            }
                            try {
                                delete bans[j];
                                fs.writeFile("./configs/bans.json", JSON.stringify(bans, null, 4), err => {
                                    if (err) console.error('Error saving bans.json file:', err);
                                });
                            }
                            catch(error) { console.log(error) }
                        }
                        return;
                    }
                    return;
                })
                .catch(error => {console.log(error)});
            continue;
        }
    }, 1000);
});
bot.on('message', message => {
    if (message.author.bot) return;

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
    fs.writeFile("./configs/guilds.json", JSON.stringify(guilds, null, 4), err => {
        if (err) console.error('Error saving guilds.json file:', err);
    });
    console.log(`Joined new server! Please set up Channel IDs.`)
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
    bot.log(`Disconnected!\n${event.reason}`)
});

bot.login(config.token)
    .then ('Successful Login.')
    .catch (error => {
        console.log(`Login unsuccessful!\n${error}`)
    })

module.exports = bot;