var e = module.exports = {};
var bu = require('./../util.js');

var bot;
e.init = (Tbot) => {
    bot = Tbot;
};
e.requireCtx = require;

e.isCommand = true;
e.hidden = false;
e.usage = 'purge';
e.info = 'Purges messages made by me.';
e.longinfo = `<p>Deletes all the messages in the current channel made by the bot, within 100 messages.</p>`;
e.category = bu.CommandType.ADMIN;

e.execute = (msg) => {
  //  if (bu.hasPerm(msg, 'Bot Commander')) {
        bot.getMessages(msg.channel.id, 100)
            .then(function (messageArray) {
                /**
                 * Checks if we have the permissions to remove them all at once
                 */
                var i;
                if (msg.channel.guild.members.get(bot.user.id).permission.json.manageMessages) {
                    console.log(`Purging all of my messages in one fell swoop-da-whoop!`);
                    var messageIdArray = [];
                    for (i = 0; i < messageArray.length; i++) {
                        if (messageArray[i].author.id === bot.user.id)
                            messageIdArray.push(messageArray[i].id);
                    }
                    bot.deleteMessages(msg.channel.id, messageIdArray);
                } else {
                    /**
                     * We don't, so we delete them one by one
                     */
                    console.log(`We're doing this the hard way!`);
                    for (i = 0; i < messageArray.length; i++) {
                        if (messageArray[i].author.id === bot.user.id) {
                            bot.deleteMessage(msg.channel.id, messageArray[i].id);
                        }
                    }
                }
            });
        bu.sendMessageToDiscord(msg.channel.id, 'Purging!')
            .then(function (message) {
                setTimeout(function () {
                    bot.deleteMessage(msg.channel.id, message.id);
                }, 5000);
            });
//    }
};