// Borrowed from SharpBot by RayzrDev - https://github.com/RayzrDev/SharpBot
const Discord = require('discord.js');
const guilds = require('../data/guilds.json');
const got = require('got');

module.exports.run = async (bot, message, args) => {
    if (message.channel.type === 'dm' ||
        message.channel.id === guilds[message.guild.id].botChannelID ||
        message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        let id;

        if (args[0] === 'latest') {
            id = (await getLatest()).num;
        } else {
            id = parseInt(args[0]);
            if (isNaN(id)) {
                id = await getRandom();
            }
        }

        // Avoid the 404 page
        while (id === 404) {
            id = await getRandom();
        }

        const info = await getInfo(id);

        message.channel.send({
            embed: new Discord.RichEmbed()
                .setTitle(`[${id}] ${info.title}`)
                .setImage(info.img)
                .setColor([150, 168, 199])
                .setURL(`http://xkcd.com/${id}`)
                .setFooter(info.alt)
        })
    }
};

async function getInfo(id) {
    return (await got(`http://xkcd.com/${id}/info.0.json`, { json: true })).body;
}

async function getLatest() {
    return (await got('http://xkcd.com/info.0.json', { json: true })).body;
}

async function getRandom() {
    const latest = await getLatest();
    const max = latest.num;

    return Math.floor(Math.random() * max);
}

module.exports.help = {
    name: 'xkcd',
    usage: 'xkcd [latest|<id>]',
    type: 'Fun',
    description: 'Fetches random or specific XKCD comics'
};
