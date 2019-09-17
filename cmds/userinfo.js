// Stolen directly from https://github.com/RayzrDev/SharpBot seems a waste to not put it to at least some good use ;-D
const dateFormat = require('dateformat');

const RichEmbed = require('discord.js').RichEmbed;

dateFormat('dddd, mmmm dS, yyyy, h:MM:ss TT');

exports.run = async (bot, message) => {
    //Makes sure command is sent in a guild
    if (!message.guild) {
        return (await message.channel.send('This can only be used in a guild!')).delete(10000);
    }
    let user = message.mentions.users.first();
    if(!user) user = message.author;
    let member = message.guild.member(user);

    if (!member) {
        return (await message.channel.send('That member could not be found!')).delete(10000);
    }

    //How long ago the account was created
    const millisCreated = new Date().getTime() - user.createdAt.getTime();
    const daysCreated = millisCreated / 1000 / 60 / 60 / 24;

    //How long about the user joined the server
    const millisJoined = new Date().getTime() - member.joinedAt.getTime();
    const daysJoined = millisJoined / 1000 / 60 / 60 / 24;
    const members = message.guild.members
    const sortedmembers = Array.from(members.sort((a, b) => {return a.joinedAt.getTime()-b.joinedAt.getTime()}).keys())
    let jopos = -1;
    let memberiter
    do {
        jopos++;
        memberiter = sortedmembers[jopos]
    } while (memberiter != member.id);

    // Getting roles array... Slicing off the first item (the @everyone)
    let roles = member.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role.name);

    let embed = new RichEmbed()
                            .setTitle(`${user.username}#${user.discriminator}`)
                            .setFooter(`requested by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                            .setThumbnail(user.displayAvatarURL)
                            .setColor(bot.colour)
                            .addField('Status',`${user.presence.status[0].toUpperCase() + user.presence.status.slice(1)}`,true)
                            .addField('Game',`${(user.presence.game && user.presence.game && user.presence.game.name) || 'Not playing a game.'}`,true)
                            .addField('Created On',`${dateFormat(user.createdAt)}`,true)
                            .addField('Days Since Creation',`${daysCreated.toFixed(0)}`,true)
                            .addField('Joined On',`${dateFormat(member.joinedAt)}`,true)
                            .addField('Days Since Joining',`${daysJoined.toFixed(0)}`,true)
                            .addField('Join position', `${jopos+1}`, true)
                            .addField('Total Role Count', `${roles.length || 'None'}`, true)
    // join order
    mget = (pos, d) => {
        out = members.get(sortedmembers[pos])
        if(out && d=='r') return ` » ${out}`
        else if(out && d=='l') return `${out} » `
        else if(out && d=='m') return `__${out}__`
        else return '';
    } // shortening the getting of member object
    embed.addField('Join Order',mget(jopos-2,'l')+mget(jopos-1,'l')+mget(jopos,'m')+mget(jopos+1,'r')+mget(jopos+2,'r'),false); 


    // roles continued
    if (roles.length > 0) {
        if(roles.join(', ').length < 1024) {
            embed.addField(`Roles`,`${roles.join(', ')}`,false)
        } else {
            let lastroles = (whileLoop(embed, roles))
            if(lastroles) embed.addField(`Roles (${lastroles.length})`,`${lastroles.join(', ')}`,false);
        }
    }
    message.channel.send(embed);
};

module.exports.help = {
    name: 'userinfo',
    usage: 'userinfo <user>',
    description: 'Shows info about a user'
};

whileLoop = (embed, roleslist) => {
    let rolesSupplementary = [];
    while(roleslist.join(', ').length>1024) {
        rolesSupplementary.push(roleslist.pop());
    }
    embed.addField(`Roles (${roleslist.length})`,`${roleslist.join(', ')}`,false)
    if(rolesSupplementary.join(', ').length>1024) {
        let out = whileLoop(embed, rolesSupplementary)
        embed.addField(`Roles (${out.length})`,`${out.join(', ')}`,false)
    } else return rolesSupplementary;
}