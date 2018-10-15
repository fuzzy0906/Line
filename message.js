var firebase = require("firebase");
var webduino = require('./webduino.js');
var getJson = require('get-json')
var config = {
    apiKey: "AIzaSyAkIc2U-MfqrCiX2RA6KyHTzgzNub2lvt0",
    authDomain: "line-bc91d.firebaseapp.com",
    databaseURL: "https://line-bc91d.firebaseio.com",
    storageBucket: "line-bc91d.appspot.com",
};
firebase.initializeApp(config);
var db = firebase.database();

class Message {
    constructor(cmd, handle) {
        this.cmd = cmd;
        this.handle = handle;
    }

    cmd(text) {
        return this.cmd(text);
    }

    handle(text) {
        return this.handle(text);
    }
}

var message = [];

function addMessage(f1, f2) {
    message.push(f1, f2);
}

addMessage(function (text) {
    return text === "開發版狀態" || text === "控制版狀態";
}, function (event) {
    var message = [];
    message.push("開發版狀態: " + (main.isConnected ? "正常連線" : "中斷連線"));
    message.push({
        "type": "text",
        "text": "是否重新連線開發版?",
        "quickReply": {
            "items": [
                {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "是",
                        "data": JSON.stringify({TYPE: "BOARD", DATA: true})
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "否",
                        "data": JSON.stringify({TYPE: "BOARD", DATA: false})
                    }
                }
            ]
        }
    });
    return message;
});

addMessage(function (text) {
    return text === "開燈";
}, function (event, text) {
    if (webduino.relayCollector(true, "message")) {
        return "已開燈";
    } else {
        return "已經是開燈狀態";
    }
});

addMessage(function (text) {
    return text === "關燈";
}, function (event, text) {
    if (webduino.relayCollector(false, "message")) {
        return "已關燈";
    } else {
        return "已經是關燈狀態";
    }
});

addMessage(function (text) {
    return text === "溫濕度" || text === "溫溼度";
}, function (event, text) {
    var dht = webduino.getDHT();
    return "現在的溫度: " + dht.temperature + " 濕度: " + dht.humidity;
});

addMessage(function (text) {
    return text.endsWith("天氣");
}, function (text) {
    var taget = text.replace("天氣","");
    getJson('http://opendata.epa.gov.tw/ws/Data/ATM00698/?$format=json', function(error, response){
        var find = false;
        for(var i = 0 ; i < response.length ; i++){
            var data = response[i];
            if(data.SiteName === taget){
                bot.push(event.source.userId, data.SiteName + " 天氣 " + data.Weather + " 溫度 " + data.Temperature);
                find = true;
                break;
            }
        }
        if(!find){
            bot.push(event.source.userId, "找不到"+text);
        }
    });
    return null;
});

addMessage(function (text) {
    return true;
}, function (text) {
    var ref = db.ref("/" + text);
    ref.once("value", function (e) {
        var respone;
        if (e.val()) {
            respone = e.val();
        } else {
            respone = '我不懂你說的 [' + text + ']';
        }
        bot.push(event.source.userId, respone);
    });
    return null;
});

module.exports = function (event) {
    var msg = event.message.text;
    for (var i = 0; i < message.length; i++) {
        if (message[i].cmd(msg)) {
            var respone = message[i].handle(msg);
            if(respone){
                console.log(msg + " ====> " + respone);
                event.reply(respone);
            }
            break;
        }
    }
};