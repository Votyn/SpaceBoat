// Mostly stolen directly from https://github.com/RayzrDev/SharpBot seems a waste to not put it to at least some good use ;-D
const dateFormat = require('dateformat');
const RichEmbed = require('discord.js').RichEmbed;

const now = new Date();
dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');

exports.run = async (bot, message) => {
    if (!message.guild) {
        throw 'This can only be used in a guild!';
    }

    const millis = new Date().getTime() - message.guild.createdAt.getTime();
    const days = millis / 1000 / 60 / 60 / 24;

    const owner = message.guild.owner.user || {};

    const verificationLevels = ['None ,(^.^),', 'Low ┬─┬ ノ( ゜-゜ノ)', 'Medium ヽ(ຈل͜ຈ)ﾉ︵ ┻━┻ ', 'High (╯°□°）╯︵ ┻━┻', 'Extreme ┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'];

    let embed = new RichEmbed()
                    .setThumbnail(message.guild.iconURL)
                    .setFooter(`requested by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                    .setColor(bot.colour)
                    .addField('Server Name', message.guild.name, true)
                    .addField('Server ID', message.guild.id, true)
                    .addField('Owner',`${owner.username + "#" + owner.discriminator || '� Owner not found...'}`,true)
                    .addField('Owner ID', `${owner.id || '� Owner not found...'}`,true)
                    .addField('Created On',`${dateFormat(message.guild.createdAt)}`, true)
                    .addField('Days Since Creation', `${days.toFixed(0)}`, true)
                    .addField('Region',`${message.guild.region}`, true)
                    .addField('Verification Level',`${verificationLevels[message.guild.verificationLevel]}`,true)
                    .addField('Text Channels',`${message.guild.channels.filter(m => m.type === 'text').size}`,true)
                    .addField('Voice Channels',`${message.guild.channels.filter(m => m.type === 'voice').size}`,true)
                    .addField('Member Count',`${message.guild.members.filter(m => m.presence.status !== 'offline').size} / ${message.guild.memberCount}`, true)
                    .addField('Roles',`${message.guild.roles.size}`,true)
                    
    if(message.guild.emojis) {
        var emojis = []
        message.guild.emojis.forEach(i => {emojis.push(`${i}`)})
        console.log(emojis)

        if(emojis.length < 25) { // In other words, if there is enough space in one field to fit them all
            emojis = emojis.join(''); // Unless the emoji names are on average longer than 18 characters, this will work.
            console.log(emojis.length)
            if(emojis.length<1014) embed.addField('Emojis', `${emojis || 'None'} \nThat's ${message.guild.emojis.size} emojis.`, false);
            else return; // If you're insane with your emoji names, I won't list them!
        }
        else {
            if(emojis.length < 50) {
                let emojis1 = emojis.slice(0,24).join('');
                let emojis2 = emojis.slice(25).join('');
                if(emojis1.length<1024 && emojis2.length<1014) {
                    embed.addField('Emojis', `${emojis1 || 'None'}`, false);
                    embed.addField('Emojis (cont)', `${emojis2 || 'None'} \nThat's ${message.guild.emojis.size} emojis.`, false);
                } else return;
            } else if(emojis.length < 75) {
                emojis1 = emojis.slice(0,24).join('');
                emojis2 = emojis.slice(25,49).join('');
                let emojis3 = emojis.slice(50).join('');
                if(emojis1.length<1024 && emojis2.length<1024 && emojis3.length<1014) {
                    embed.addField('Emojis', `${emojis1 || 'None'}`, false);
                    embed.addField('Emojis (cont)', `${emojis2 || 'None'}`, false);
                    embed.addField('Emojis (continued)', `${emojis3 || 'None'} \nThat's ${message.guild.emojis.size} emojis.`, false);
                } else return;
            } else if(emojis.length < 100) {
                emojis1 = emojis.slice(0,24).join('');
                emojis2 = emojis.slice(25,49).join('');
                emojis3 = emojis.slice(50,74).join('');
                let emojis4 = emojis.slice(75).join('');
                if(emojis1.length<1024 && emojis2.length<1024 && emojis3.length<1024 && emojis4.length<1014) {
                    embed.addField('Emojis', `${emojis1 || 'None'}`, false);
                    embed.addField('Emojis (cont)', `${emojis2 || 'None'}`, false);
                    embed.addField('Emojis (continued)', `${emojis3 || 'None'}`, false);
                    embed.addField('Emojis (continued) (by the way you\'re friggen mad.)', `${emojis4 || 'None'} \nThat's ${message.guild.emojis.size} emojis.`, false);
                } else return;
            } else if(emojis.length < 125) {
                emojis1 = emojis.slice(0,24).join('');
                emojis2 = emojis.slice(25,49).join('');
                emojis3 = emojis.slice(50,74).join('');
                emojis4 = emojis.slice(75,99).join('');
                let emojis5 = emojis.slice(100).join('');
                if(emojis1.length<1024 && emojis2.length<1024 && emojis3.length<1024 && emojis4.length<1024 && emojis5.length<1014) {
                    embed.addField('Emojis', `${emojis1 || 'None'}`, false);
                    embed.addField('Emojis (cont)', `${emojis2 || 'None'}`, false);
                    embed.addField('Emojis (continued)', `${emojis3 || 'None'}`, false);
                    embed.addField('Emojis (continued) (by the way you\'re friggen mad.)', `${emojis4 || 'None'}`, false);
                    embed.addField('Emojis (continued) (why. why do you have so many)', `${emojis5 || 'None'} \nThat's ${message.guild.emojis.size} emojis.`, false);
                } else return;
            } else {
                let response = bot.utils.randomSelection([
                    `Nope. Too many.`,
                    `I refuse to list these.`,
                    `You have way. Too. Many. Emojis.`,
                    `...`,
                    'why?',
                    'No. Just no. You\'ve got way too many.',
                    'nope',
                    '<:rauf:427621360286826496>',
                    '<:thenk:427621426514755601>',
                    '<:oh:427621570320531456>',
                    '<:waitwhat:427621591036198914>',
                    '<a:gone:427621026957099009>',
                    '<:ohno:427621654684893194>',
                    '<:thohno:427621998089338880>'
                ])
                embed.addField('Emojis', response + ` There's like... ${message.guild.emojis.size} emojis.`, false)
            }
        }
    }
    if(message.guild.features.join(', ')) embed.addField('Features', `${message.guild.features.join(', ') || 'None'}`);
    console.log(message.guild.features)
    message.channel.send(embed);
    
};

module.exports.help = {
    name: 'serverinfo',
    usage: 'serverinfo',
    description: 'Shows info of the server you are in'
};
