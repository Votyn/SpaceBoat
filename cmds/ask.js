const guilds = require("../data/guilds.json");

module.exports.run = (bot, message, args) => {
    if (message.channel.id === guilds[message.guild.id].botChannelID ||
        message.channel.id === guilds[message.guild.id].adminbotChannelID) {
        if (Object.keys(args).length < 1) {
            let response = bot.utils.randomSelection([
                `What?`,
                `I'm not telepathic you know...`,
                `I can't answer a question if you don't ask me one <:thinksmart:427622363547303937>`,
                `...`,
                '<:tearthonk:427621281525923842>',
                '<:rauf:427621360286826496>',
                '<:thenk:427621426514755601>',
                '<:oh:427621570320531456>',
                '<:waitwhat:427621591036198914>',
                '<a:gone:427621026957099009>',
                '<:ohno:427621654684893194>',
                '<:thohno:427621998089338880>'
            ]);
            return message.channel.send(response);
        }
        else {
            randomUserID = message.mentions.members.randomKey()
            if (message.mentions.members.has(166125035092836352) || 
                message.content.toLowerCase().indexOf('votyn') > 1 ) { // yes i am vain
                let response = bot.utils.randomSelection([
                    `That's not something I'm willing to discuss.`,
                    `Why don't you ask him yourself?`,
                    `Hmm... Not sure about that one...`,
                    `Obviously.`,
                    `Never.`,
                    `Why though?`,
                    `Not sure. Ask again later maybe?`,
                    '<:soontm:427622707824427018>',
                    `Not likely`,
                    `I think so.`,
                    `I don't think so...`,
                    `Maybe...`,
                    `I'm not sure.`,
                    `Why would you ask that? <:rauf:427621360286826496>`,
                    `I hope not!`,
                    `I hope so...`,
                    `Well now that you ask...`,
                    `I would count on it.`,
                    `Is that even a question?`,
                    `Not on my watch!`,
                    '<:sweats:427623000087592965>'
                ]);
                return message.channel.send(response);
            }
            else if (randomUserID) {
                let response = bot.utils.randomSelection([
                    `Why don't you ask them yourself?`,
                    `Let them answer that question. I don't know everything after all.`,
                    `Some questions are best left to those whom they involve.`,
                    `Why not ask them yourself?`,
                    `Well since you mentioned them, let them answer <:rauf:427621360286826496>`,
                    `I don't think so...`,
                    `Maybe they do...`,
                    `That's not for me to say.`,
                    `Why though?`,
                    `Not sure. Ask again later maybe?`,
                    `<:soontm:427622707824427018>`,
                    `Not likely`,
                    `I think so.`,
                    `I'm not sure.`,
                    `Why would you ask that? <:rauf:427621360286826496>`,
                    `I hope not!`,
                    `I hope so...`,
                    `Well now that you ask...`,
                    `I would count on it.`,
                    `Is that even a question?`,
                    `Not on my watch!`,
                ]);
                return message.channel.send(response);
            }
            else { // Can also be used for dm usage in future.
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
                    `Why would you ask that? <:rauf:427621360286826496>`,
                    `I hope not!`,
                    `I hope so...`,
                    `Well now that you ask...`,
                    `I would count on it.`,
                    `Is that even a question?`,
                    `Not on my watch!`,
                    '<:tearthonk:427621281525923842>',
                    '<:rauf:427621360286826496>',
                    '<:thenk:427621426514755601>',
                    '<:oh:427621570320531456>',
                    '<:waitwhat:427621591036198914>',
                    '<a:gone:427621026957099009>',
                    '<:ohno:427621654684893194>',
                    '<:thohno:427621998089338880>',
                    '<:sweats:427623000087592965>',
                    `<a:elegiggle:427623412807237632>`
                ]);
                return message.channel.send(response);
            }
        }
    }
};


module.exports.help = {
    name: 'ask',
    usage: 'ask <question>',
    type: 'Fun',
    description: 'Ask Space Boat a question. Don\'t expect it to be right though.'
};
