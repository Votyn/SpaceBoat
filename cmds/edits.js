const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    var msg;
    var edits;
    if (args[1]) {
        let msgid = args[1]
        let channelid = args[0]
        let channel = await message.guild.channels.get(channelid)
        if (channel.id == channelid) {
            msg = await channel.fetchMessage(msgid)
            if (msg.id == msgid) {
                edits = msg.edits
            } else return;
        } else return;
    } else {
        let msgid = args[0];
        msg = await message.channel.fetchMessage(msgid)
        if (msg.id == msgid) {
            edits = msg.edits
        } else return;
    }
    let editarray = []
    edits.forEach(e => editarray.unshift(` - ${e}`));
    let embed = new Discord.RichEmbed().setAuthor('Message Edits', msg.author.displayAvatarURL)
                                       .setDescription(editarray)
                                       .setTimestamp(msg.editedAt || msg.createdAt)
                                       .setColor(bot.colour)
    message.channel.send(embed);
}

module.exports.help = {
    name: "edits",
    type: "Moderation"
}