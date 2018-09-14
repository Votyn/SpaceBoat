module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to purge without sufficient permissions!`); //check permission

    let count = parseInt(args[0]) || 1; // How many messages to delete?

    message.channel.bulkDelete(count + 1) // Delete the messages
        .then(deleted => message.channel.send(`:white_check_mark: Purged \`${deleted.size-1}\` message${(deleted.size-1) === 1 ? '' : 's'}.`).then(msg => msg.delete(2000))) // Notify success.
        .catch(error => {
                    if (error.message === 'You can only bulk delete messages that are under 14 days old.') {
                        message.channel.send(`:interrobang: Can't bulk delete messages older than 2 weeks!`).then(msg => msg.delete(2000))
                    } else {
                        console.error
                    }

                }) // Catch error

}

module.exports.help = {
    name: "purge",
    type: "Moderation"
}
