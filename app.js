var express = require('express');
var config = require('./config/config');

var app = express();

//This app is basic static files right now.
app.use(express.static('public'))

app.listen(config.port, function(err){
  if (err) throw err;
  console.log('Running on port ' + config.port);
});

//Exporting app to be used anywere
module.exports = app;
