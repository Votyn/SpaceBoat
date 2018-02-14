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

const client = new Discord.Client();
client.commands = new Discord.Collection();

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
        client.commands.set(props.help.name, props);
    });
});


client.on('ready', () => {
    console.log(`${client.user.username} switched on.`);

    let clientGuildsIDs = Array.from( client.guilds.keys() );
    for (let i in clientGuildsIDs) {
        if (!guilds.hasOwnProperty(clientGuildsIDs[i])) {
            console.log(`Setting up ${clientGuildsIDs[i]}`);
            guilds[clientGuildsIDs[i]] = {
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
        let guild = client.guilds.get(i)
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

    client.setInterval(() => {
        //console.log(mutes);
        for (let i in mutes) {
            //console.log(i);
            let time = mutes[i].time;
            let guildId = mutes[i].guild;
            let guild = client.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "Muted");

            if (!member) {
                console.log('ERROR: User is not in the server anymore!'); 
                delete mutes[i];
                fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                    if (err) console.error('Error saving mutes.json file: ', err);
                });
                continue;
            }
            if (!mutedRole) { console.log('no Muted role found!'); continue };
            if (!member.roles.has(mutedRole.id)) { 
                console.log('User has been manually unmuted!'); 
                delete mutes[i];
                fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                    if (err) console.error('Error saving mutes.json file: ', err);
                });
                continue;
            }

            if (Date.now() > time) {
                let logChannel = guild.channels.get(guilds[guildId].logChannelID)
                member.removeRole(mutedRole);
                console.log(`${member.user.username} has been unmuted.`);
                try {
                    logChannel.send({
                        embed: new Discord.RichEmbed()
                            .setDescription(`**Target:** ${member}\n**Moderator:** ${client.user}\n**Automatic.**`)
                            .setFooter(`ID: ${member.id}`)
                            .setAuthor(`Member unmuted.`, member.user.displayAvatarURL)
                            .setTimestamp()
                    })
                }
                catch (error) {
                    console.log('No logchannel defined for this guild!');
                }
                
                mutes[i] = null;
                delete mutes[i];
                fs.writeFileSync("./configs/mutes.json", JSON.stringify(mutes, null, 4), err => {
                    if (err) console.error('Error saving mutes.json file:', err);
                });
            }
        }
    });
    client.setInterval(() => {
        for (let i in bans) {
            let time = bans[i].time;
            let guildId = bans[i].guild;
            let guild = client.guilds.get(guildId);
            let member = guild.members.get(i);

            // if (!member.roles.has(mutedRole.id)) { 
            //     console.log('User has been manually unmuted!'); 
            //     delete bans[i];
            //     fs.writeFileSync("./configs/bans.json", JSON.stringify(ban, null, 4), err => {
            //         if (err) console.error('Error saving bans.json file: ', err);
            //     });
            //     continue;
            // }

            if (Date.now() > time) {
                let logChannel = guild.channels.get(guilds[guildId].logChannelID)
                console.log(`${member.user.username} has been unbanned.`);
                try {
                    logChannel.send({
                        embed: new Discord.RichEmbed()
                            .setDescription(`**Target:** ${member}\n**Moderator:** ${client.user}\n**Automatic.**`)
                            .setFooter(`ID: ${member.id}`)
                            .setAuthor(`Member unbanned.`, member.user.displayAvatarURL)
                            .setTimestamp()
                    })
                }
                catch (error) {
                    console.log('No logchannel defined for this guild!');
                }
                
                bans[i] = null;
                delete bans[i];
                fs.writeFileSync("./configs/bans.json", JSON.stringify(bans, null, 4), err => {
                    if (err) console.error('Error saving bans.json file:', err);
                });
            }
        }
    });
});
client.on('message', message => {
    if (message.author.bot) return;
    if (!(message.channel.type === "text")) return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(config.prefix)) return;

    let cmd = client.commands.get(command.slice(config.prefix.length));
    if (cmd) cmd.run(client, message, args);
});

client.on('guildMemberAdd', member => {
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
        console.log('No logchannel defined for this guild!');
    }
    console.log(`Member joined! ${member.user.tag}`);
});

client.on('guildMemberRemove', member => {
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
        console.log('No logchannel defined for this guild!');
    }
    console.log(`Member left! ${member.user.tag}`);
});

client.on('guildCreate', guild => {
    guilds[guild.id] = {
        logChannelID: "",
        botChannelID: "",
        adminbotChannelID: ""
    }
    fs.writeFile("./guilds.json", JSON.stringify(guilds, null, 4), err => {
        if (err) console.error('Error saving guilds.json file:', err);
    });
    console.log(`Joined new server! Please set up Channel IDs.`)
});

client.login(config.token);

module.exports = client;