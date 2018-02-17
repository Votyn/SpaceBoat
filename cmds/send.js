module.exports.run = async (client, message, args) => {
    if (message.author.id == 166125035092836352) {
        message.channel.send(args.splice(0).join(' '))
        message.delete(0)
    }
}
module.exports.help = {
    name: "send",
    usage: "send <message>",
    description: "Sends a message via the bot. Restricted to bot owner."
}