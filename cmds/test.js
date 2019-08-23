// a small testing command that is easily editable.
const Discord = require('discord.js');

const config = require("../data/config.json");
module.exports.run = async (bot, message, args) => {
    if (!(message.author.id == config.ownerid)) return;
    if (args[0] == 'log') return console.log(message);
    if (args[0] == 'splice') return console.log(args.splice(1).join(' '));
    if (args[0] == 'giverole') { //for c418 server.
        console.log(args[1]);
        let role = message.guild.roles.find(r => r.id === args[1]);
        if(!role) return (await message.channel.send("That ain't a role, daddy!")).delete(10000);
        console.log(role.name)
        message.guild.members.forEach(member => {
            console.log(member.user.username)
                if (member.roles.size > 1) {
                    if(member.roles.find(r => r.id === args[1])) return;
                    else member.addRole(role, "Added by ray for everyone with a role.");
                }
            }
        )
        
    }
    else return console.log(message);
    // secret update
}

module.exports.help = {
    name: "test",
    type: "Private"
}