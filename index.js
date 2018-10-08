var linebot = require('linebot');
var express = require('express');
var path = require('path');
require('webduino-js');
require('webduino-blockly');
var temperature = 0;
var humidity = 0;

var bot = linebot({
    channelId: '1611515190',
    channelSecret: '342749f3c76b5380e4dc196f92346b5e',
    channelAccessToken: 'Ra1NJBqqKd/SLfLpR3DLrK4djVu9DD3uPUglecgJiHOxyuxWIpJY6UdXfWfwxxy26FS42ayJU1DSKGfs74JAofDSbXZL9/QC2v7S9tyLs33LRZteE/aaGy5nPZyaPadYTOFckTuegKBkkCG4j5UYHAdB04t89/1O/w1cDnyilFU='
});

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyAkIc2U-MfqrCiX2RA6KyHTzgzNub2lvt0",
    authDomain: "line-bc91d.firebaseapp.com",
    databaseURL: "https://line-bc91d.firebaseio.com",
    storageBucket: "line-bc91d.appspot.com",
};
firebase.initializeApp(config);
var db = firebase.database();

var relay;
var dht;

boardReady({device: '8BYgM'}, function (board) {
  board.systemReset();
  board.samplingInterval = 50;
  relay = getRelay(board, 10);
  dht = getDht(board, 11);
  dht.read(function(evt){
      temperature = dht.temperature;
      humidity = dht.humidity;
  },1000);
  relay.off();
});

var handle = {
    "開燈": function (event) {
        relay.on();
        event.reply("已開燈");
    },
    "關燈": function (event) {
        relay.on();
        event.reply("已關燈");
    },
    "溫溼度":function (event) {
        event.reply("現在的溫度: " + dht.temperature + " 濕度: "+dht.humidity);
    }
};

bot.on('message', function (event) {
    if(handle[event.message.text]){
        handle[event.message.text](event);
    }else{
        var ref = db.ref("/" + event.message.text);
        ref.once("value",function (e) {
            var respone;
            if(e.val()){
                respone = e.val();
            }else{
                respone = '我不懂你說的 ['+event.message.text+']';
            }
            bot.push(event.source.userId,respone);
            console.log(event.message.text + " ====> " + respone);
        })
    }
});

bot.on('beacon', function (event) {
    console.log('beacon: ' + event.beacon.type);
    var respone;
    switch(event.beacon.type){
        case 'enter':
              respone = '你進入教室';
              relay.on();
              break;
        case 'leave':
              respone = '你離開教室';
              relay.off();	    
             break;
        default:
             respone = '我壞掉了';
     }
     bot.reply(event.replyToken, respone);
});

const app = express();
const linebotParser = bot.parser();
app.set('/views', path.join(__dirname, 'views'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.post('/', linebotParser);
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;	
	bot.push('U6bb0958b3ed12c5e75b310f4192a3ed8','Server is ready');
    console.log("App now running on port", port);
});
