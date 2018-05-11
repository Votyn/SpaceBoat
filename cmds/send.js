const config = require("../data/config.json")

module.exports.run = async (bot, message, args) => {
    if (message.author.id == config.ownerid) {
        if (args != []) {
            message.channel.send(message.content.slice(6)).catch(err => console.log(err.message))
        }
        try {message.delete(0).catch(err => {console.log(`Couldn't delete message`)})}
        catch(error) {console.log(error.message)}
    }
}
module.exports.help = {
    name: "send",
    usage: "send <message>",
    type: "Private",
    description: "Sends a message via the bot. Restricted to bot owner."
}