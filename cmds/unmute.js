module.exports.run = async (client, message, args) => {
    console.log("unmuting...");
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to unmute without sufficient permissions!`); //check permission
    let toUnmute = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned user
    if (!toUnmute) return console.log(`${message.author.username} failed to specify a user to unmute!`); //check user mentioned

    let role = message.guild.roles.find(r => r.name === "Muted"); //search for role

    toUnmute.removeRole(role);
    message.channel.send(`${toUnmute.user.username} has been unmuted.`);
    console.log(`${toUnmute.user.username} has been unmuted.`);
}

module.exports.help = {
    name: "unmute"
}