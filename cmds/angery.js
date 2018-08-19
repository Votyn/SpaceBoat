module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return; // Only usable by Moderators/Admins

    console.log(`${message.author.username} is ANGERY`) // Record event to console why not
    var gif
    if (args[0] == 'celebrity') {
        gif = bot.utils.randomSelection([ //randomly select from a list of gifs.
            `https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/source.gif`, // celebrity related disappointment
            `https://media.giphy.com/media/y1WDIwAZRSmru/giphy.gif`,
            `https://media.giphy.com/media/GjR6RPcURgiL6/giphy.gif`,
            `https://media.giphy.com/media/QHYHhShm1sjVS/giphy.gif`,
            `https://media.giphy.com/media/PJfISpc3CEcaA/giphy.gif`,
            `https://media.giphy.com/media/GKSNQKQlQ3du0/giphy.gif`,
            `https://media.giphy.com/media/ilkfz8Mn5Yz7O/giphy.gif`,
            `https://media.giphy.com/media/KuJesxZSpHoXu/giphy.gif`,
            `https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif`
        ]);
    }else if (args[0] == 'doctor') {
        gif = bot.utils.randomSelection([
        `https://media.giphy.com/media/IzSnJ0mFJOEjC/giphy.gif`, // Doctor Who related disappointment
        `https://media.giphy.com/media/Jq7y34Hgfy01y/giphy.gif`,
        `https://media.giphy.com/media/jAtIMGP4jwV2M/giphy.gif`,
        `https://media.giphy.com/media/wrezVcxv2OviU/giphy.gif`,
        `https://media.giphy.com/media/YcmtvvCYmn7Ec/giphy.gif`,
        `https://media.giphy.com/media/LU22SxTChRpvO/giphy.gif`
        ]);
    } else if (args[0] == `gordon`) {
        gif = bot.utils.randomSelection([
            `https://media.giphy.com/media/Bcpspr9LTSvss/giphy.gif`, // Gordon Ramsey disappointment
            `https://media.giphy.com/media/NDz6jE0rf5S7e/giphy.gif`,
            `https://media.giphy.com/media/j0AYFl0muDgXe/giphy.gif`,
            `https://media.giphy.com/media/xfgrghdzmcptS/giphy.gif`
        ]);
    } else if (args[0] == `cartoon`) {
        gif = bot.utils.randomSelection([
            `https://media.giphy.com/media/xUA7aKWkjTfDUREx8Y/source.gif`, //cartoon
            `https://media.giphy.com/media/ug9SeZBFLKHtK/giphy.gif`,
            `https://media.giphy.com/media/pYI1hSqUdcBiw/giphy.gif`,
            `https://media.giphy.com/media/a7YZNbWvIgvh6/giphy.gif`,
            `https://media.giphy.com/media/4w6g6yOWJYtm8/giphy.gif`,
            `https://media.giphy.com/media/2xPPgIRAbU0yZBMo3F/giphy.gif`,
            `https://media.giphy.com/media/242C34NxcI3PsqeJi9/giphy.gif`,
            `https://media.giphy.com/media/BWW03LrvL6W88/giphy.gif`,
            `https://media.giphy.com/media/ch1pcRhEb0c1y/giphy.gif`,
            `https://media.giphy.com/media/v5iPxSka8A03C/giphy.gif`,
            `https://media.giphy.com/media/DHt4WOAbjgE8w/giphy.gif`,
            `https://media.giphy.com/media/12XfNqI44ICkUg/giphy.gif`,
            `https://media.giphy.com/media/zMe5y4Lfy52Sc/giphy.gif`,
            `https://media.giphy.com/media/vz4rWqFNihWqk/giphy.gif`,

            `https://media.giphy.com/media/8YWZqADaY5YSBZO3WA/source.gif`, //final space
            `https://media.giphy.com/media/YU7v4hHTHdcxH0JmWf/giphy.gif`,
            `https://media.giphy.com/media/1BdtWbNu32vnj89ue3/giphy.gif`,
            `https://media.giphy.com/media/5wFjgRZWRU6W5JDBB2/giphy.gif`
        ]);
    } else if (args[0] == `finalspace`) {
        gif = bot.utils.randomSelection([
            `https://media.giphy.com/media/8YWZqADaY5YSBZO3WA/source.gif`, //final space
            `https://media.giphy.com/media/YU7v4hHTHdcxH0JmWf/giphy.gif`,
            `https://media.giphy.com/media/1BdtWbNu32vnj89ue3/giphy.gif`,
            `https://media.giphy.com/media/5wFjgRZWRU6W5JDBB2/giphy.gif`
        ]);
    } else {
        gif = bot.utils.randomSelection([
            `https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/source.gif`, // celebrity related disappointment
            `https://media.giphy.com/media/y1WDIwAZRSmru/giphy.gif`,
            `https://media.giphy.com/media/GjR6RPcURgiL6/giphy.gif`,
            `https://media.giphy.com/media/QHYHhShm1sjVS/giphy.gif`,
            `https://media.giphy.com/media/PJfISpc3CEcaA/giphy.gif`,
            `https://media.giphy.com/media/GKSNQKQlQ3du0/giphy.gif`,
            `https://media.giphy.com/media/ilkfz8Mn5Yz7O/giphy.gif`,
            `https://media.giphy.com/media/KuJesxZSpHoXu/giphy.gif`,
            `https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif`,

            `https://media.giphy.com/media/IzSnJ0mFJOEjC/giphy.gif`, // Doctor Who related disappointment
            `https://media.giphy.com/media/Jq7y34Hgfy01y/giphy.gif`,
            `https://media.giphy.com/media/jAtIMGP4jwV2M/giphy.gif`,
            `https://media.giphy.com/media/wrezVcxv2OviU/giphy.gif`,
            `https://media.giphy.com/media/YcmtvvCYmn7Ec/giphy.gif`,
            `https://media.giphy.com/media/LU22SxTChRpvO/giphy.gif`,

            `https://media.giphy.com/media/Bcpspr9LTSvss/giphy.gif`, // Gordon Ramsey disappointment
            `https://media.giphy.com/media/NDz6jE0rf5S7e/giphy.gif`,
            `https://media.giphy.com/media/j0AYFl0muDgXe/giphy.gif`,
            `https://media.giphy.com/media/xfgrghdzmcptS/giphy.gif`,

            `https://media.giphy.com/media/xUA7aKWkjTfDUREx8Y/source.gif`, //cartoon
            `https://media.giphy.com/media/ug9SeZBFLKHtK/giphy.gif`,
            `https://media.giphy.com/media/pYI1hSqUdcBiw/giphy.gif`,
            `https://media.giphy.com/media/a7YZNbWvIgvh6/giphy.gif`,
            `https://media.giphy.com/media/4w6g6yOWJYtm8/giphy.gif`,
            `https://media.giphy.com/media/2xPPgIRAbU0yZBMo3F/giphy.gif`,
            `https://media.giphy.com/media/242C34NxcI3PsqeJi9/giphy.gif`,
            `https://media.giphy.com/media/BWW03LrvL6W88/giphy.gif`,
            `https://media.giphy.com/media/ch1pcRhEb0c1y/giphy.gif`,
            `https://media.giphy.com/media/v5iPxSka8A03C/giphy.gif`,
            `https://media.giphy.com/media/DHt4WOAbjgE8w/giphy.gif`,
            `https://media.giphy.com/media/12XfNqI44ICkUg/giphy.gif`,
            `https://media.giphy.com/media/zMe5y4Lfy52Sc/giphy.gif`,
            `https://media.giphy.com/media/vz4rWqFNihWqk/giphy.gif`,

            `https://media.giphy.com/media/8YWZqADaY5YSBZO3WA/source.gif`, //final space
            `https://media.giphy.com/media/YU7v4hHTHdcxH0JmWf/giphy.gif`,
            `https://media.giphy.com/media/1BdtWbNu32vnj89ue3/giphy.gif`,
            `https://media.giphy.com/media/5wFjgRZWRU6W5JDBB2/giphy.gif`,
        ]);
    }
    try {message.channel.send(gif)} // send randomlyish selected gif
        catch(error) {console.log(error)}
    try {message.delete(0).catch(err => {console.log(`Couldn't delete message`)})}
        catch(error) {console.log(error.message)}
    return;
}

module.exports.help = {
    name: "angery",
    usage: "angery [celebrity/doctor/gordon/cartoon/finalspace]",
    type: "Moderation",
    description: "Show that you are starting to get annoyed quickly and easily with this fun little command dedicated to the hard working moderation!"
}