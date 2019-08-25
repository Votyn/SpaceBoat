const Discord = require('discord.js')
const fs = module.require("fs");

const rolereact = require("../data/rolereact.json");

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    //let count = args[0]
    //if (isNaN(count)) {

    //      EMOJI SELECT
    let emoji = args[0] // unicode emoji
    if (emoji[0] == '<') {
        let emojiID = args[0].split(':')[2].split('>')[0]; //custom emoji ID.
        //console.log(emojiID);
        emoji = bot.emojis.get(emojiID)
        if(!emoji) return (await message.channel.send("Yeh that emoji doesn't work for some reason. Probably not an emoji I can use?")).delete(10000);
    }
    //console.log(emoji);
    if(!emoji) return (await message.channel.send("Something went wrong with the emoji you chose.")).delete(10000);
    
    //      ROLE SELECT
    let roletext = args[1]
    if (roletext[0] == `"`) {
        for (var i = 2; args[i][args[i].length-1] != `"`; i++) {
            roletext += ` ${args[i]}`
        }
        roletext += ` ${args[i]}`
        //console.log(i);
        //console.log(roletext);
    }
    rolename = roletext.replace(/"/g,"");
    //console.log(rolename);
    //console.log(roletext.splice(-1))
    var role = message.guild.roles.find(r => r.name == rolename);
    if(!role) return (await message.channel.send("Something went wrong with role selection. Role doesn't exist?")).delete(10000);
    //console.log(role)
    let msg = message.content.slice(13 + args[0].length + roletext.length);
    if (!msg) return (await message.channel.send(`Please supply a message!`)).delete(10000);
    let sentmsg = await message.channel.send(msg);
    sentmsg.react(emoji);
    //} else for (let i=0; i<count; i++) {
        
    //}

    rolereact[sentmsg.id] = {
        emoji: args[0],
        role: role.id
    }
    fs.writeFileSync("./data/rolereact.json", JSON.stringify(rolereact, null, 4), err => {
        if (err) throw err;
    });
}

module.exports.help = {
    name: "rolereact",
    type: "Administration",
    usage: "rolereact <emoji (standard, non-custom emojis only)> <role name (one word only)> <message>",
    description: "Creates a new message sent by the bot that will wait for reactions to that message that are the same emoji as stated in the command, and apply the stated role."
}
