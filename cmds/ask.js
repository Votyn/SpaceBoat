const guilds = require("../configs/guilds.json");

module.exports.run = (bot, message, args) => {
    if (message.channel.type === 'dm' ||
        message.channel.id === guilds[message.guild.id].botChannelID ||
        message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        if (args.length < 1) {
            let response = bot.utils.randomSelection([
                `What?`,
                `I'm not telepathic you know...`,
                `I can't answer a question if you don't ask me one :CantNoIfDont:`,
                `...`,
                `:tearthonk:`,
                `:rauf:`,
                `:heccoff:`,
                `:thenk:`,
                `:autismthonk:`,
                `:oh:`,
                `:waitwhat:`,
                `:gone:`,
                `:wcnohno:`
            ]);
            return message.channel.send(response);
        }
        else if (message.channel.type === 'text') {
            randomUserID = message.mentions.members.randomKey()
            if (message.mentions.members.has(166125035092836352) ||
                message.content.toLowerCase().indexOf('votyn') > 1 ) {
                let response = bot.utils.randomSelection([
                    `That's not something I'm willing to discuss.`,
                    `Why don't you ask him yourself?`,
                    `Hmm... Not sure about that one...`,
                    `Obviously.`,
                    `Never.`,
                    `Why though?`,
                    `Not sure. Ask again later maybe?`,
                    `Soon:tm:`,
                    `Not likely`,
                    `I think so.`,
                    `I don't think so...`,
                    `Maybe...`,
                    `I'm not sure.`,
                    `Why would you ask that? :rauf:`,
                    `I hope not!`,
                    `I hope so...`,
                    `Well now that you ask...`,
                    `I would count on it.`,
                    `Is that even a question?`,
                    `Not on my watch!`,
                    `:sweats:`
                ]);
                return message.channel.send(response);
            }
            else if (randomUserID) {
                let response = bot.utils.randomSelection([
                    `Why don't you ask them yourself?`,
                    `Let them answer that question. I don't know everything after all.`,
                    `Some questions are best left to those whom they involve.`,
                    `Why not ask them yourself?`,
                    `Well since you mentioned them, let them answer :rauf:`,
                    `I don't think so...`,
                    `Maybe they do...`,
                    `That's not for me to say.`,
                    `Why though?`,
                    `Not sure. Ask again later maybe?`,
                    `Soon:tm:`,
                    `Not likely`,
                    `I think so.`,
                    `I'm not sure.`,
                    `Why would you ask that? :rauf:`,
                    `I hope not!`,
                    `I hope so...`,
                    `Well now that you ask...`,
                    `I would count on it.`,
                    `Is that even a question?`,
                    `Not on my watch!`,
                ]);
                return message.channel.send(response);
            }
        
        }
        else {
            let response = bot.utils.randomSelection([
                `Hmm... Not sure about that one...`,
                `Obviously.`,
                `Never.`,
                `Why though?`,
                `Not sure. Ask again later maybe?`,
                `Soon:tm:`,
                `Not likely`,
                `I think so.`,
                `I don't think so...`,
                `Maybe...`,
                `I'm not sure.`,
                `Why would you ask that? :rauf:`,
                `I hope not!`,
                `I hope so...`,
                `Well now that you ask...`,
                `I would count on it.`,
                `Is that even a question?`,
                `Not on my watch!`,
                `:tearthonk:`,
                `:rauf:`,
                `:sweats:`,
                `:elegiggle:`,
                `:autismthonk:`,
                `:thenk:`
            ]);
            return message.channel.send(response);
        }
    }
};


module.exports.help = {
    name: 'ask',
    usage: 'ask <question>',
    type: 'Fun',
    description: 'Ask Space Boat a question. Don\'t expect it to be right though.'
};
