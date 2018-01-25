module.exports.run = async (client, message, args) => {
    console.log("muting...")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to mute without sufficient permissions!`); //check permission
    let toMute = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned user
    if (!toMute) return console.log(`${message.author.username} failed to specify a user to mute!`); //check if user mentioned
    if (message.member.highestRole <= toMute.highestRole) return console.log(`${message.author.username} attempted to mute a member with a higher role!`); //check role

    let role = message.guild.roles.find(r => r.name === "Muted"); //search for role
    if (!role) { //if no role, create role
        try {
            role = await message.guild.createRole({ //create role
                name: "muted",
                color: "#8a",
                permissions: []
            });

            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
            console.log('Created muted role');
        } catch (error) {
            console.log(error.stack);
        }
    }

    if (toMute.roles.has(role.id)) return console.log(`${toMute.user.username} already muted!`);

    await toMute.addRole(role);
    message.channel.send(`${toMute.user.username} has been muted.`);
    console.log(`${toMute.user.username} has been muted.`);

    return;
}

module.exports.help = {
    name: "mute"
}