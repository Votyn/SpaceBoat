module.exports.run = async (bot, msg) => {
    const m = await msg.channel.send('Pong!');
    m.edit(`:ping_pong: Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
}; //stolen from https://github.com/RayzrDev/RayzrDevBot.git

module.exports.help = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};