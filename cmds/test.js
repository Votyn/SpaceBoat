// a small testing command that is easily editable.
module.exports.run = async (bot, message, args) => {
    if (!(message.author.id == 166125035092836352)) return;
    console.log(args)
    message.channel.send(`<a:bannedgif:418028681412345862>`)
}

module.exports.help = {
    name: "test",
    type: "Private"
}