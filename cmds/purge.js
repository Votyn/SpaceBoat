const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to purge without sufficient permissions!`); //check permission

    let count = parseInt(args[0]) || 1; // How many messages to delete?

    message.channel.bulkDelete(count + 1) // Delete the messages
        .then(deleted => {
            // notify success
            if(bot.thanos.includes(message.author.id)) {
                await(message.channel.send(new Discord.RichEmbed()
                                                            .setImage('https://media1.tenor.com/images/e36fb32cfc3b63075adf0f1843fdc43a/tenor.gif?itemid=12502580')
                                                            .setColor(bot.colour)
                                                            .setDescription(`Purged \`${deleted.size-1}\` message${(deleted.size-1) === 1 ? '' : 's'}.`))
                ).delete(30000)
                .catch(console.error);
            } // For the doc
            else message.channel.send(`:white_check_mark: Purged \`${deleted.size-1}\` message${(deleted.size-1) === 1 ? '' : 's'}.`).then(msg => msg.delete(2000));
        })
        .catch(error => {
                    if (error.message === 'You can only bulk delete messages that are under 14 days old.') {
                        message.channel.send(`:interrobang: Can't bulk delete messages older than 2 weeks!`).then(msg => msg.delete(2000))
                    } else {
                        console.error
                    }

                }); // Catch error
        

}

module.exports.help = {
    name: "purge",
    type: "Moderation"
}