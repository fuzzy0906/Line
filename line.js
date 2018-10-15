const linebot = require('linebot');
const webduino = require('./webduino.js');

// bot = linebot({
//     channelId: '1611395821',
//     channelSecret: '9ef254b41a42e547e0294fd2accae9e4',
//     channelAccessToken: 'tEiKGNqO3jaKqD1Jom0rAodKJB3M7FRr7RntWR1w6X8x9b7Il7ym7bVPtuYAPGOnD8BerCcpgjfGwWD1MCFWAU9wRkLLHQaYRl87c/y48F1CQLUrINtVf2F/U67qiaVRwAMrmRegmYe2mWVplcmP9wdB04t89/1O/w1cDnyilFU='
// });
bot = linebot({
    channelId: '1611515190',
    channelSecret: '342749f3c76b5380e4dc196f92346b5e',
    channelAccessToken: 'Ra1NJBqqKd/SLfLpR3DLrK4djVu9DD3uPUglecgJiHOxyuxWIpJY6UdXfWfwxxy26FS42ayJU1DSKGfs74JAofDSbXZL9/QC2v7S9tyLs33LRZteE/aaGy5nPZyaPadYTOFckTuegKBkkCG4j5UYHAdB04t89/1O/w1cDnyilFU='
});

const message = require('./message.js');
bot.on('message', message);

bot.on('postback', function (event) {
    var json = JSON.parse(event.postback.data);
    switch (json.TYPE) {
        case "BOARD":
            if (json.DATA) {
                webduino.connectionBoard();
                event.reply("開發版重新連線");
            } else {
                event.reply("取消開發版重新連線");
            }
            break;
    }
});

bot.on('beacon', function (event) {
    console.log('beacon: ' + event.beacon.type);
    var respone;
    switch (event.beacon.type) {
        case 'enter':
            if (webduino.relayCollector(true, "beacon")) {
                respone = '你進入教室';
            }
            break;
        case 'leave':
            if (webduino.relayCollector(false, "beacon")) {
                respone = '你進入教室';
            }
            break;
        default:
            respone = '我壞掉了';
    }
    if (respone) {
        event.reply(respone);
    }
});