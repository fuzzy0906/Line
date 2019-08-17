const linebot = require('linebot');
const webduino = require('./webduino.js');

bot = linebot({
    channelId: '1611515190',
    channelSecret: '8cba55586e414817d198141ad975cd4b',
    channelAccessToken: 'g876X+5/6uQUQh0AkyEQDR0NrbiGJs6Z1Ix5c7jGtynE2Q8LnHDEPTDQfzlcxAU06FS42ayJU1DSKGfs74JAofDSbXZL9/QC2v7S9tyLs33ShKz74/z3jx9ljlE5q/gsQpa5ouF2CAxhDKsRbakzMAdB04t89/1O/w1cDnyilFU='
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
    var msg;
    switch (event.beacon.type) {
        case "enter":
            msg = "進入教室";
            break;
        case "leave":
            msg = "離開教室";
            break;
        default:
            return;
    }
    event.reply("你" + msg);
    if(event.source.userId != "U6bb0958b3ed12c5e75b310f4192a3ed8"){
        bot.getUserProfile(event.source.userId).then(function (profile) {
            bot.push("U6bb0958b3ed12c5e75b310f4192a3ed8", profile.displayName + msg);
        })
    }
    // console.log('beacon: ' + event.beacon.type);
    // var respone;
    // switch (event.beacon.type) {
    //     case 'enter':
    //         if (webduino.relayCollector(true, "beacon")) {
    //             respone = '你進入教室';
    //         }
    //         break;
    //     case 'leave':
    //         if (webduino.relayCollector(false, "beacon")) {
    //             respone = '你離開教室';
    //         }
    //         break;
    //     default:
    //         respone = '我壞掉了';
    // }
    // if (respone) {
    //     event.reply(respone);
    // }
});