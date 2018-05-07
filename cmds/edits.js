const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    console.log('checking edits')
    var msg;
    var edits;
    if (args[1]) {
        console.log('channel id supplied?')
        let msgid = args[1]
        let channelid = args[0]
        let channel = await message.guild.channels.get(channelid)
        if (channel.id == channelid) {
            console.log('channel id verified')
            msg = await channel.fetchMessage(msgid)
            if (msg.id == msgid) {
                console.log('msg id verified')
                edits = msg.edits.join('\n')
            } else return;
        } else return;
    } else {
        let msgid = args[0];
        msg = await message.channel.fetchMessage(msgid)
        if (msg.id == msgid) {
            console.log('msg id verified')
            edits = msg.edits.join('\n')
        } else return;
    }
    
    let embed = new Discord.RichEmbed().setAuthor('Message Edits', msg.author.displayAvatarURL)
                                       .setDescription(edits)
                                       .setTimestamp(msg.editedAt || msg.createdAt)
    message.channel.send(embed);
}

module.exports.help = {
    name: "edits",
    type: "Moderation"
}