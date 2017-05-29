var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');

var app = express();
app.use(bodyParser.urlencoded({'extended':'true'})); //parse application/x-www-form-urlencoded

//This app is basic static files right now.
app.use(express.static('public'));

mongoose.connect(config.db);
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + config.db);

  //I'll only start the app if I can connect properly to DB
  app.listen(config.port, function(err){
    if (err) throw err;
    console.log('Running on port ' + config.port);
  });

});
var db = mongoose.connection;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/todos', (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + '/public/index.html');
});

//Exporting app and db to be used anywere
module.exports = app;
