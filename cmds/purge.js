module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to purge without sufficient permissions!`); //check permission

    let count = parseInt(args[0]) || 1; // How many messages to delete?

    message.channel.bulkDelete(count) // Delete the messages
        .then(messages => message.channel.send(`:white_check_mark: Purged \`${messages.size}\` message${messages.size === 1 ? '' : 's'}.`)) // Notify success.
        .catch(error => {
                    if (error.message === 'You can only bulk delete messages that are under 14 days old.') {
                        message.channel.send(`:interrobang: Can't bulk delete messages older than 2 weeks!`)
                    } else {
                        console.error
                    }

                }) // Catch error

}

module.exports.help = {
    name: "purge",
    type: "Moderation"
}
