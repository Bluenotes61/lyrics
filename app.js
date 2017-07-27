/**
 * Start module for the application
 */  
                                      
var express = require('express');
var swig = require('swig');
var path = require('path');  
var config = require("./config.js");  

var app = express();     
  
var server = app.listen(config.serverport, function() {
  console.log('Listening on port %d', server.address().port);
});      

global.appRoot = path.resolve(__dirname);

app.engine("html", swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/routes');  
app.use("/", express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.render("index");
});

app.get("/onetext", function(req, res){
  res.render("onetext");
});
