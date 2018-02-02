const webdict = module.require('webdict');
const Discord = module.require('discord.js');
const config = require("../configs/config.json");
const guilds = require("../configs/guilds.json");


module.exports.run = async (client, message, args) => {
    if (message.channel.id === guilds[message.guild.id].botChannelID) {
        let term = args.join(' ');
        webdict('urbandictionary', term)
            .then(resp => {
                message.channel.send({
                    embed: new Discord.RichEmbed()
                        .setTitle(`:book: ${term}`)
                        .setDescription(resp.definition[0])
                });
            });
    }
    if (message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        let term = args.join(' ');
        webdict('urbandictionary', term)
            .then(resp => {
                message.channel.send({
                    embed: new Discord.RichEmbed()
                        .setTitle(`:book: ${term}`)
                        .setDescription(resp.definition[0])
                });
            });
    }
}

module.exports.help = {
    name: "urban",
    usage: "urban <term>",
    description: "Searches the Urban Dictionary for the specified term."
}