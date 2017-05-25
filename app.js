var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');

var app = express();

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

//Exporting app and db to be used anywere
module.exports = app;
module.exports = db;
