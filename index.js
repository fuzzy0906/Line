var express = require('express');
var path = require('path');
var webduino = require('./webduino.js');
webduino.connectionBoard();
var line = require('./line.js');

var app = express();
app.set('/views', path.join(__dirname, 'views'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.post('/', line.parser());
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    line.push('U6bb0958b3ed12c5e75b310f4192a3ed8','Server is ready');
    console.log("App now running on port", port);
});
