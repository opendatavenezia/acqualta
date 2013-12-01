
/**
 * Module dependencies.
 */

var _ = require('underscore');
var express = require('express');
var api = require('./controllers/api')();
var http = require('http');
var path = require('path');
var app = express();

// app configurations
var config = require('./config.js');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if ('production' == app.get('env')) {
  // throttle requests TBD
  /*
  var extras = require('express-extras');
  app.configure(function() {
    app.use(extras.throttle());

    //Or supply a config object
    //The default config shown..
    app.use(extras.throttle({
      urlCount: 5,
      urlSec: 1,
      holdTime: 30,
      whitelist: {
          '127.0.0.1': true
      }
    }));
  });
  */
}

// routes
app.get('/api/devices/:device_id?', api.apiAction.init, api.apiAction.devices);
app.get('/api/data/:device_id?', api.apiAction.init, api.apiAction.data);
//app.get('/api/device/:id', api.apiAction.init, api.apiAction.devices);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
