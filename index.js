var linebot = require('linebot');
var express = require('express');
var path = require('path');
require('webduino-js');
require('webduino-blockly');

var bot = linebot({
    channelId: '1611515190',
    channelSecret: '342749f3c76b5380e4dc196f92346b5e',
    channelAccessToken: 'Ra1NJBqqKd/SLfLpR3DLrK4djVu9DD3uPUglecgJiHOxyuxWIpJY6UdXfWfwxxy26FS42ayJU1DSKGfs74JAofDSbXZL9/QC2v7S9tyLs33LRZteE/aaGy5nPZyaPadYTOFckTuegKBkkCG4j5UYHAdB04t89/1O/w1cDnyilFU='
});

var message = {
    "你好嗎":"我很好謝謝",
    "你是誰":"我是機器人",
    "你很棒":"謝謝你的誇獎",
    "你的名字":"楊榮仁",
    "你幾歲":"我10歲"
};

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

boardReady({device: '8BYgM'}, function (board) {
  board.systemReset();
  board.samplingInterval = 50;
  relay = getRelay(board, 10);
  relay.off();
});

bot.on('message', function (event) {
    if(event.message.text === '開燈'){
        relay.on();
        bot.reply(event.replyToken, "已開燈");
    }else if(event.message.text === '關燈'){
        relay.off();	    
        bot.reply(event.replyToken, "已關燈");
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
	
    //var respone;
    //if(event.message.text === '開燈'){
    //    relay.on();
    //    respone = "已開燈";
    //}else if(event.message.text === '關燈'){
    //    relay.off();	    
    //    respone = "已關燈";
    //}else if(message[event.message.text]){
    //    respone = message[event.message.text];
    //}else{
    //    respone = '我不懂你說的 ['+event.message.text+']';
    //}
	//console.log(event.message.text + ' -> ' + respone);
    //bot.reply(event.replyToken, respone);
	
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
app.post('/', linebotParser);
app.get('/', function(req, res) {
    res.send('Welcome to LineBot');
});

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;	
	bot.push('U6bb0958b3ed12c5e75b310f4192a3ed8','Server is ready');
    console.log("App now running on port", port);
});
