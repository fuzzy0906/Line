const express = require('express');
const path = require('path');
const webduino = require('./webduino.js');
webduino.connectionBoard();
require('./line.js');

const app = express();
app.set('/views', path.join(__dirname, 'views'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.post('/', bot.parser());
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

const server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    line.push('U6bb0958b3ed12c5e75b310f4192a3ed8','Server is ready');
    console.log("App now running on port", port);
});
