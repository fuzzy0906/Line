require('webduino-js');
require('webduino-blockly');
var temperature = 0;
var humidity = 0;
var relay;
var dht;
var main;
var pir;
var relayStatus = 'none';

function isConnection() {
    return main.isConnected;
}

function getDHT() {
    return {temperature: temperature, humidity: humidity};
}

function connectionBoard() {
    boardReady({device: '8BYgM'}, function (board) {
        main = board;
        board.systemReset();
        board.samplingInterval = 50;
        relay = getRelay(board, 10);
        dht = getDht(board, 11);
        pir = getPir(board, 7);
        relayCollector(false, "init");
        dht.read(function (evt) {
            temperature = dht.temperature;
            humidity = dht.humidity;
        }, 1000);
        pir.on("detected", function () {
            relayCollector(true, "pir");
            bot.push('U6bb0958b3ed12c5e75b310f4192a3ed8', '有人靠近了');
        });
        pir.on("ended", function () {
            relayCollector(false, "pir");
        });
    });
}

function relayCollector(status, who) {
    if (status) {
        if (relayStatus === 'on') {
            return false;
        }
        console.log("RelayCollector status turn on by " + who);
        relay.on();
        relayStatus = 'on';
        return true;
    } else {
        if (relayStatus === 'off') {
            return false;
        }
        console.log("RelayCollector status turn on by " + who);
        relay.off();
        relayStatus = 'off';
        return true;
    }
}

module.exports = {
    isConnection: isConnection,
    connectionBoard: connectionBoard,
    relayCollector: relayCollector,
    getDHT: getDHT
}