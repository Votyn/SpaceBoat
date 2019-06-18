const fs = module.require("fs");
const Discord = module.require('discord.js');
const guilds = require("../data/guilds.json");
const suspendrolename = require("../data/suspendrolename.json");
const config = require("../data/config.json")

module.exports.run = async (bot, message, args) => {
    if (!(message.channel.type === "text")) return;
    console.log("suspending...");
    //import logChannel.
    // const logChannel = message.guild.channels.get(guilds[message.guild.id].logChannelID);   // (not using)
    //check permissions.
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return console.log(`${message.author.username} attempted to suspend without sufficient permissions!`);
    //import target member from the message.
    let target = message.mentions.members.first() || message.guild.members.get(args[0]);
    //breaks if there is no target member.
    if (!target) {
        if (!args[0]) return;
        else if (args[0] == `-config`) {
            // ---------------------------- config ----------------------------
            if (!args[1]) {
                (await message.channel.send(`Please supply the name of an existing role!`)).delete(10000);
                return;
            } else {
                let role = message.guild.roles.find(r => r.name === args[1]);
                if (role) {
                    suspendrolename[message.guild.id] = {
                        roleid: role.id
                    }
                    fs.writeFileSync("./data/suspendrolename.json", JSON.stringify(suspendrolename, null, 4), err => {
                        if (err) throw err;
                    });
                    return;
                } else {
                    (await message.channel.send(`Please supply the name of an existing role!`)).delete(10000);
                    return;
                }
            }
        } else return;
    
    }

    //checks if target is a moderator.
    if (target.hasPermission("MANAGE_MESSAGES")) {
        console.log(`Error: ${target.user.username} is a moderator.`);
        (await message.channel.send(`${target.user.username} is a moderator!`)).delete(10000);
        return;
    }
    //searches for the role
    try {
        console.log(suspendrolename[message.guild.id].roleid)
        var role = message.guild.roles.find(r => r.id == suspendrolename[message.guild.id].roleid);

    } catch (error) {
        (await message.channel.send(`Woops, no can do, no role! Set up using ${config.prefix}suspend -config`)).delete(10000);
        return;
    }
    //if no muted role exists...
    // if (!role) {
    //     (await message.channel.send(`Woops, no can do, no role! Set up using ${config.prefix}suspend -config`)).delete(10000);
    //     return;
    // }
    //makes sure that the bot's highest role is above the muted role.
    if (message.guild.me.highestRole.comparePositionTo(role) < 1) {
        console.log(`ERROR: Cannot assign suspension role!`);
        return;
    }


    // ---------------------------- UNSUSPEND ----------------------------


    if (target.roles.has(role.id)) {
        console.log("unsuspending....")
        target.removeRole(role, `Unsuspended by ${message.author.username}`)
        console.log(`${target.user.username} unsuspended!`);
        (await message.channel.send(`${target.user.username} unsuspended!`)).delete(10000);
        return;
    } else {


        // ---------------------------- SUSPEND ----------------------------


        if (!args[1]) {
            target.addRole(role, `Suspended by ${message.author.username}`)
        } else {
            let reason = args.splice(1).join(' ')
            target.addRole(role, `Suspended by ${message.author.username}; "${reason}"`)
        }
    }
    return;
}

module.exports.help = {
    name: "suspend",
    usage: "suspend <username>",
    type: "Moderation",
    description: "Gives user a predefined role"
}
