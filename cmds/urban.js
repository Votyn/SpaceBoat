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
                    `Sorry I can't find that in the urban dictionary...`,
                    `Not here!`,
                    `That doesn't appear to have an urban definition. Why don't you add one?`,
                    `I can't find a definition for this.`,
                    `Doesn't appear to be here. Why don't you say what it might be? That's basically what the urban dictionary is <:tearthonk:383856193073840129>`,
                    `<:tearthonk:383856193073840129>`,
                    `<:sweats:370656909134659604>`,
                    `<a:gone:393837219854680066>`
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
