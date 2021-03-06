var e = module.exports = {};
var bu = require('./../util.js');

var bot;
e.init = (Tbot) => {
    bot = Tbot;
};
e.requireCtx = require;

e.isCommand = true;
e.hidden = false;
e.usage = 'setprefix [prefix]';
e.info = 'Sets the command prefix.';
e.longinfo = `<p>Sets the custom command prefix for the guild. You can set it to anything. If no prefix is specified, disables the custom prefix.</p>`;
e.category = bu.CommandType.COMMANDER;

e.execute = (msg, words, text) => {
    if (words.length > 1) {
        var prefix = text.replace(words[0], '').trim();
        bu.guildSettings.set(msg.channel.guild.id, 'prefix', prefix).then(() => {
            bu.sendMessageToDiscord(msg.channel.id, `Set the custom command prefix to '${prefix}'`);
        });
    } else {
        bu.guildSettings.remove(msg.channel.guild.id, 'prefix').then(() => {
            bu.sendMessageToDiscord(msg.channel.id, `Reset your command prefix!`);
        });
        
    }
    //   }
};