const webdict = module.require('webdict');
const Discord = module.require('discord.js');
const guilds = require("../data/guilds.json");

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
                let message = bot.utils.randomSelection([
                    `What's that meant to be?`,
                    `:rauf:`,
                    `Sorry I can't find that in the urban dictionary...`,
                    `:tearthonk:`,
                    `Not here!`
                ]);
                message.channel.send(message).then(m => m.delete(10000));
            })
    }
}

module.exports.help = {
    name: "urban",
    usage: "urban <term>",
    type: "Fun",
    description: "Searches the Urban Dictionary for the specified term."
}