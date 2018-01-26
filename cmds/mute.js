const fs = module.require("fs")

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

    if (toMute.roles.has(role.id)) {
        console.log(`${toMute.user.username} already muted!`) 
        (message.channel.send(`${toMute.user.username} already muted!`)).delete(10000)
    };

    if (args[1]) {
        client.mutes[toMute.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * 1000
        }
        console.log(`args[1]`);
    }

    await toMute.addRole(role);

    fs.writeFile("./mutes.json", JSON.stringify(client.mutes, null, 4), err => {
        if (err) throw err;
        message.channel.send(`${toMute.user.username} has been muted.`);
        console.log(`${toMute.user.username} has been muted.`);
    });

    return;
}

module.exports.help = {
    name: "mute"
}