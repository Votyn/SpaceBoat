const fs = module.require("fs");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    console.log("muting...")
    const logChannel = message.guild.channels.get(config.logChannelID)
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to mute without sufficient permissions!`); //check permission
    let toMute = message.mentions.members.first() || message.guild.members.get(args[0]); //get mentioned member
    if (!toMute) return console.log(`${message.author.username} failed to specify a user to mute!`); //check if user mentioned
    if (message.member.highestRole.comparePositionTo(toMute.highestRole) < 0) return console.log(`${message.author.username} attempted to mute a member with a higher role!`); //check role
    
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
        console.log(`${toMute.user.username} already muted!`);
        (await message.channel.send(`${toMute.user.username} already muted!`)).delete(5000);
        return;
    }

    await toMute.addRole(role);

    if (args[1]) {
        mutes[toMute.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * 60000
        }
        console.log(`args[1]`);
        fs.writeFile("./mutes.json", JSON.stringify(mutes, null, 4), err => {
            if (err) throw err;
            logChannel.send(`${toMute.user.username} has been muted for ${args[1]} minutes.`);
            console.log(`${toMute.user.username} has been muted for ${args[1]} minutes.`);
        });
        (await message.channel.send(`${toMute.user.username} has been muted for ${args[1]} minutes.`)).delete(20000);
    }

    if (!args[1]) {
        (await message.channel.send(`${toMute.user.username} has been muted.`)).delete(20000);
        logChannel.send(`${toMute.user.username} has been muted.`);
        console.log(`${toMute.user.username} has been muted.`);
    }

    return;
}

module.exports.help = {
    name: "mute"
}