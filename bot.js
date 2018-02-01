const config = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");
guilds = require("./guilds.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
mutes = require("./mutes.json");

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
    console.log(client.commands);
    for (let i in guilds) {
        let guild = client.guilds.get(i)
        if (!guilds[i].logChannelID) {
            console.log(`ERROR: Server [${guild.name}] does not have a logging channel!, ${i[0]}`)
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
            if (!mutedRole) { console.log('no Muted role found!'); continue };
            
            if (Date.now() > time) {
                let logChannel = guild.channels.get(guilds[guildId].logChannelID)
                member.removeRole(mutedRole);
                console.log(`${member.user.username} has been unmuted.`);
                logChannel.send({
                    embed: new Discord.RichEmbed()
                        .setDescription(`**Target:** ${member}\n**Moderator:** ${client.user}\n**Automatic.**`)
                        .setFooter(`ID: ${member.id}`)
                        .setAuthor(`Member unmuted.`, member.user.displayAvatarURL)
                        .setTimestamp()
                });
                mutes[i] = null;
                delete mutes[i];
                fs.writeFileSync("./mutes.json", JSON.stringify(mutes, null, 4), err => {
                    if (err) console.error('Error saving mutes.json file:', err);
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
    let logChannel = member.guild.channels.get(config.logChannelID)
    logChannel.send({
        embed: new Discord.RichEmbed()
            .setThumbnail(member.user.displayAvatarURL)
            .setDescription(`${member} - ${member.user.username}#${member.user.discriminator}`)
            .setFooter(`ID: ${member.id}`)
            .setAuthor(`Member joined!`, member.user.displayAvatarURL)
            .setTimestamp()
    })
});

client.on('guildMemberRemove', member => {
    let logChannel = member.guild.channels.get(config.logChannelID)
    logChannel.send({
        embed: new Discord.RichEmbed()
            .setThumbnail(member.user.displayAvatarURL)
            .setDescription(`${member} - ${member.user.username}#${member.user.discriminator}`)
            .setFooter(`ID: ${member.id}`)
            .setAuthor(`Member left.`, member.user.displayAvatarURL)
            .setTimestamp()
    })
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