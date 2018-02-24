const Discord = require('discord.js');
const guilds = require("../configs/guilds.json");

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    if (message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        if (!args[0]) {
            //show a snowflake of all warns.
        }
        else if (args[0] == 'config') {
            if (!args[1]) {
                let message = bot.utils.randomSelection([
                    `Please supply a user id to configure`,
                    `Config what??`,
                    `You didn't supply a user id...`
                ]);
                (await message.channel.send(message)).delete(10000);
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
}

module.exports.help = {
    name: "warns",
    usage: "warn [<config>] [<user>]",
    description: "Allows the viewing"
}