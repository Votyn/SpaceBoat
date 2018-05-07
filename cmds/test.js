// a small testing command that is easily editable.
const Discord = require('discord.js')

const config = require("../data/config.json")
module.exports.run = async (bot, message, args) => {
    if (!(message.author.id == config.ownerid)) return;
    let embed = new Discord.RichEmbed().setTitle('DISCORD LINKS')
                                            .addField('SpaceEngine Official (this)', 'https://discord.gg/spaceengine')
                                            .addField('SpaceEngine Italian', 'https://discord.gg/t5BJpfv')
                                            .addField('SpaceEngine French', 'https://discord.gg/DyEs4TD')
                                            .addField('RU SpaceEngine (русский)', 'https://discord.gg/aEJ42Ej')
                                            .addField('SpaceEngine Addons', 'https://discord.gg/RpaDp5q')
    message.channel.send(embed)
}

module.exports.help = {
    name: "test",
    type: "Private"
}