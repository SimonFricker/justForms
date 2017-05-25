console.log('The app has started');

var express = require('express');
var app = express();
var path = require('path');




// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/demo/index.html'));
});

app.listen(8080);
