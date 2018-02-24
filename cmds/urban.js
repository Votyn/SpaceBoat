const webdict = module.require('webdict');
const Discord = module.require('discord.js');
const guilds = require("../configs/guilds.json");

module.exports.run = async (bot, message, args) => {
    if (message.channel.type === 'dm' ||
        message.channel.id === guilds[message.guild.id].botChannelID ||
        message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        let term = args.join(' ');
        await webdict('urbandictionary', term)
            .then (resp => {
                message.channel.send({
                    embed: new Discord.RichEmbed()
                        .setTitle(`:book: ${term}`)
                        .setDescription(resp.definition[0])
                });
            })
            .catch (error => {
                console.log('Error serving urban dictionary definition');
                message.channel.send(':x:').then(m => m.delete(10000));
            })
    }
}

module.exports.help = {
    name: "urban",
    usage: "urban <term>",
    description: "Searches the Urban Dictionary for the specified term."
}