const firebase = require("firebase");
const webduino = require('./webduino.js');
const getJson = require('get-json')
firebase.initializeApp({
    apiKey: "AIzaSyAkIc2U-MfqrCiX2RA6KyHTzgzNub2lvt0",
    authDomain: "line-bc91d.firebaseapp.com",
    databaseURL: "https://line-bc91d.firebaseio.com",
    storageBucket: "line-bc91d.appspot.com",
});
const db = firebase.database();

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

var messages = [];

function addMessage(f1, f2) {
    messages.push(new Message(f1, f2));
}

addMessage(function (text) {
    return text === "開發版狀態" || text === "控制版狀態";
}, function (event) {
    let message = [];
    message.push("開發版狀態: " + (webduino.isConnection ? "正常連線" : "中斷連線"));
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
    return "現在的溫度:  " + dht.temperature + "        現在的濕度:  " + dht.humidity;
})

addMessage(function (text) {
    return text.endsWith("天氣");
}, function (text,userId) {
    let taget = text.replace("天氣","");
    getJson('http://opendata.epa.gov.tw/ws/Data/ATM00698/?$format=json', function(error, response){
        let find = false;
        for(let i = 0 ; i < response.length ; i++){
            let data = response[i];
            if(data.SiteName === taget){
                bot.push(userId, data.SiteName + "天氣 " + data.Weather + " 溫度 " + data.Temperature);
                find = true;
                break;
            }
        }
        if(!find){
            bot.push(userId, "找不到"+text);
        }
    });
    return "開始查詢" + taget + "天氣...請稍後";
});

addMessage(function (text) {
    return text.endsWith("景高");
}, function (text,userId) {
    return {
        "type": "template",
        "altText": "景文高中介紹",
        "template": {
            "type": "carousel",
            "columns": [
                {
                    "thumbnailImageUrl": "https://imgur.com/pVDopY6.png",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": "工業類科",
                    "text": "INDUSTRY",
                    "actions": [
                        {
                            "type": "uri",
                            "label": "資訊科",
                            "uri": "http://www.jwsh.tp.edu.tw/files/11-1000-422.php"
                        },
                        {
                            "type": "postback",
                            "label": ".",
                            "data": JSON.stringify({TYPE:"NONE"})
                        },
                        {
                            "type": "postback",
                            "label": ".",
                            "data": JSON.stringify({TYPE:"NONE"})
                        }
                    ]
                },
                {
                    "thumbnailImageUrl": "https://imgur.com/qUXBf3a.png",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": "商業類科",
                    "text": "BUSINESS",
                    "actions": [
                        {
                            "type": "uri",
                            "label": "流通管理科",
                            "uri": "http://www.jwsh.tp.edu.tw/files/11-1000-1730.php"
                        },
                        {
                            "type": "uri",
                            "label": "商業經營科",
                            "uri": "http://163.21.103.15/files/11-1000-416.php"
                        },
                        {
                            "type": "postback",
                            "label": ".",
                            "data": JSON.stringify({TYPE:"NONE"})
                        }
                    ]
                },
                {
                    "thumbnailImageUrl": "https://imgur.com/muQmRJb.png",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": "外語類科",
                    "text": "ENGLISH",
                    "actions": [
                        {
                            "type": "uri",
                            "label": "應用外語科",
                            "uri": "http://www.jwsh.tp.edu.tw/files/11-1000-419.php?Lang=zh-tw"
                        },
                        {
                            "type": "postback",
                            "label": ".",
                            "data": JSON.stringify({TYPE:"NONE"})
                        },
                        {
                            "type": "postback",
                            "label": ".",
                            "data": JSON.stringify({TYPE:"NONE"})
                        }
                    ]
                },
                {
                    "thumbnailImageUrl": "https://i.imgur.com/2wUGbi2.png",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": "設計類科",
                    "text": "DESIGN",
                    "actions": [
                        {
                            "type": "uri",
                            "label": "廣告設計科",
                            "uri": "http://163.21.103.15/files/11-1000-417.php"
                        },
                        {
                            "type": "uri",
                            "label": "室內設計科",
                            "uri": "http://163.21.103.15/files/11-1000-420.php"
                        },
                        {
                            "type": "uri",
                            "label": "多媒體設計科",
                            "uri": "http://163.21.103.15/files/11-1000-418.php"
                        }
                    ]
                }
            ],
            "imageAspectRatio": "square",
            "imageSize": "contain"
        }
    };
});

addMessage(function (text) {
    return true;
}, function (text,userId) {
    let ref = db.ref("/" + text);
    ref.once("value", function (e) {
        let res = "";
        if (e.val()) {
            res = e.val();
        } else {
            res = '我不懂你說的 [' + text + ']';
        }
        bot.push(userId, res);
    });
    return null;
});

module.exports = function (event) {
    let msg = event.message.text;
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].cmd(msg)) {
            let res = messages[i].handle(msg,event.source.userId);
            if(res){
                console.log(msg + " ====> " + res);
                event.reply(res);
            }
            break;
        }
    }
};
