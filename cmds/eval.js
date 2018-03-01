const inspect = require('util').inspect;
const Discord = require('discord.js');

const clean = input => {
    const output = typeof input === 'string' ? input : inspect(input);
    return output.replace(/(@|`)/g, '$1\u200b');
};

module.exports.run = async (bot, message, args) => {
    //only I can use this command!
    if (message.author.id != 166125035092836352) return;

    const input = args.join(' ');
    if (!input) {
        (await message.channel.send('You must provide some code to evaluate!')).delete(10000);
    }

    message.delete(10000);

    try {
        const output = clean(eval(input));
        message.channel.send({
            embed: new Discord.RichEmbed()
                .addField('Input', `\`\`\`javascript\n${input.substr(0, 256)}\n\`\`\``)
                .addField('Output', `\`\`\`javascript\n${output.substr(0, 768)}\n\`\`\``)
                .setFooter(`Requested by ${message.author.tag}`)
        }).then(m => m.delete(15000));
    } catch (err) {
        message.channel.send(`:x: An error has occurred: \`\`\`\n${err.toString().substr(0, 1500)}\n\`\`\``);
    }
};

module.exports.help = {
    name: 'eval',
    usage: 'eval <js code>',
    type: "Private",
    description: 'Evaluates some JavaScript code. Restricted to bot owner.',
};