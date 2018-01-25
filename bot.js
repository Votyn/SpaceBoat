const config = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");

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
    console.log(`${client.user.username} switched on.`)
    console.log(client.commands)
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

client.login(config.token);

module.exports = client;