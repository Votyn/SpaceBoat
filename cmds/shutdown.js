module.exports.run = async (bot, message, args) => {
    console.log(message.author.id)
    if (!(message.author.id == 166125035092836352)) return;
    console.log(`shutting down...`)
    bot.destroy()
}

module.exports.help = {
    name: "shutdown",
    type: "Private"
}