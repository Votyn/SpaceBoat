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
                let response = bot.utils.randomSelection([
                    `What's that meant to be?`,
                    `:rauf:`,
                    `Sorry I can't find that in the urban dictionary...`,
                    `:tearthonk:`,
                    `Not here!`,
                    `Doesn't appear to have an urban definition. Why don't you add one?`,
                    `I can't find a definition for this.`,
                    `Doesn't appear to be here. Why don't you say what it might be? That's basically what the urban dictionary is :tearthonk:`,
                    `:banned:`
                ]);
                message.channel.send(response);
            })
    }
}

module.exports.help = {
    name: "urban",
    usage: "urban <term>",
    type: "Fun",
    description: "Searches the Urban Dictionary for the specified term."
}