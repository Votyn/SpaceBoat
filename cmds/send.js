module.exports.run = async (client, message, args) => {
    if (message.author.id == 166125035092836352) {
        await message.channel.send(args.splice(0).join(' '))
        message.delete()
    }
}
module.exports.help = {
    name: "send",
    usage: "send <message>",
    description: "Sends a message via the bot. Restricted to bot owner."
}