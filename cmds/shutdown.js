module.exports.run = async (client, message, args) => {
    console.log(message.author.id)
    if (!(message.author.id == 166125035092836352)) return;
    console.log(`shutting down...`)
    client.destroy()
}

module.exports.help = {
    name: "shutdown"
}