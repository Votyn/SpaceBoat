const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (message.author.id == config.ownerid) {
        const m = await message.channel.send('Pong!');
        m.edit(`:ping_pong: Pong! \`${m.createdTimestamp - message.createdTimestamp}ms\``);
    }
    return;
}; //stolen from https://github.com/RayzrDev/RayzrDevBot.git

module.exports.help = {
    name: 'ping',
    usage: 'ping',
    type: "Private",
    description: 'Pings the bot. Restricted to the bot owner.'
};