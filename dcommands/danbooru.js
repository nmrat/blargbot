var e = module.exports = {};
var bu = require('./../util.js');
var https = require('https');

var bot;
e.init = (Tbot) => {
    bot = Tbot;
};

e.requireCtx = require;

e.isCommand = true;
e.hidden = false;
e.usage = 'danbooru <tags...>';
e.info = 'Gets three pictures from \'<https://danbooru.donmai.us/>\' using given tags.';
e.longinfo = `<p>Displays three images obtained from <a href="https://danbooru.donmai.us/">danbooru.donmai.us</a> using the
        provided tags. You can use up to 2 tags at a time. Results have the possibility of being NSFW. If the current
        channel is not designated as NSFW, a user needs to include the 'rating:safe' tag in order to use the command.</p>`;
e.category = bu.CommandType.NSFW;

e.execute = (msg, words) => {
    bu.isNsfwChannel(msg.channel.id).then(nsfwChannel => {
        var tagList = JSON.parse(JSON.stringify(words));
        delete tagList[0];
        if (words.length > 1)
            for (i = 1; i < tagList.length; i++) {
                console.log(`${i}: ${tagList[i]}`);

                tagList[i] = tagList[i].toLowerCase();
            }
        //  listylist = tagList;
        //    console.log(`${'rating:safe' in tagList} ${'rating:s' in tagList} ${'rating:safe' in tagList || 'rating:s' in tagList} ${!('rating:safe' in tagList || 'rating:s' in tagList)}`)
        if (!nsfwChannel)
            if (!(tagList.indexOf('rating:safe') > -1 || tagList.indexOf('rating:s') > -1)) {
                //        console.log(kek); 
                bu.sendMessageToDiscord(msg.channel.id, bu.config.general.nsfwMessage);

                return;
            }
        var query = '';
        for (var tag in tagList) {
            query += tagList[tag] + '%20';
        }

        var url = '/posts.json?limit=' + 50 + '&tags=' + query;
        var message = '';

        console.log('url: ' + url);
        var options = {
            hostname: 'danbooru.donmai.us',
            method: 'GET',
            port: 443,
            path: url,
            headers: {
                'User-Agent': 'blargbot/1.0 (ratismal)'
            }
        };

        var req = https.request(options, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                try {
                    var doc = JSON.parse(body);
                    var urlList = [];
                    var ii = 0;
                    if (doc.length > 0)
                        for (i = 0; i < doc.length; i++) {
                            var imgUrl;
                            if (doc[i].file_url) {
                                imgUrl = `http://danbooru.donmai.us${doc[i].file_url}`;
                                if (imgUrl.endsWith('.gif') || imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.jpeg')) {
                                    urlList[ii] = imgUrl;
                                    ii++;
                                }
                            }
                        }
                    console.log(urlList.length);
                    if (urlList.length == 0) {
                        bu.sendMessageToDiscord(msg.channel.id, 'No results found!');
                        return;
                    }
                    message += `Found **${urlList.length}/50** posts\n`;
                    for (var i = 0; i < 3; i++) {
                        if (urlList.length > 0) {
                            var choice = bu.getRandomInt(0, urlList.length - 1);
                            message += urlList[choice] + '\n';
                            console.log(`${choice} / ${urlList.length} - ${urlList[choice]}`);
                            urlList.splice(choice, 1);
                        }
                    }
                    bu.sendMessageToDiscord(msg.channel.id, message);
                } catch (err) {
                    console.log(err.stack);
                }
            });
        });
        req.end();
    });

};