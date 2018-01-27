const config = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");

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
    console.log(`${client.user.username} switched on.`)
    console.log(client.commands)

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
                let logChannel = guild.channels.get(config.logChannelID)
                member.removeRole(mutedRole);
                console.log(`${member.user.username} has been unmuted.`);
                logChannel.send(`${member.user.username} has been unmuted.`);
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


client.login(config.token);

module.exports = client;