//apiController.js
module.exports = function() {
  // instance model
  var _ = require('underscore');
  var mysql = require('mysql');
  var model = require('../model/data.js')();
  var dbc = model.connect();

  // controller
  var self = {
    // api object
    apiAction: {
      init: function(request, response, next) {
        // init data renderers
        render = require('../lib/render')(request, response);

        // options
        limit = (request.query.limit ? parseInt(request.query.limit) : 30);
        offset = (request.query.offset ? parseInt(request.query.offset) : 0);
        type = (request.query.type ? request.query.type  : 'raw'); // render type


        // define error callback
        err_callback = function(err) {
          render.json(err, 'error')
        }

        // proxy
        req = request;
        res = response;

        // follow next call
        next();
      },

      // get data from devices
      data: function() {
        var device_id = req.params.device_id;
        var params = [];

        // build query
        q = "SELECT dl.id, dl.id_device, dl.date_sent, dl.tweet, dl.level, dl.battery_voltage, dl.panel_voltage, dl.temperature, dl.csq, dl.ber, \
             d.latitude, d.longitude, d.description, d.twitter_enabled, d.location, d.district, d.alias \
             FROM device_log AS dl \
             JOIN device AS d ON dl.id_device = d.id";
             // joining this table makes the query very slow, as we have more billions of record in this table
             //        q = "SELECT dl.*, d.latitude, d.longitude, d.description, d.twitter_enabled, d.location, d.district, d.alias, dld.id_log, dld.id_row \
             //              JOIN device_log_details AS dld ON dl.id = dld.id_log \

        if (device_id) {
          q += " WHERE dl.id_device = ?";
          params.push(device_id);
        }

        // last parts
        q += " ORDER BY dl.date_sent DESC";
        q += " LIMIT ?, ?";

        // query params
        params.push(offset);
        params.push(limit);
        model.query(q, params, function(results) {
          // flatten json
          flattened_results = _.flatten(_.compact(results));
          render.json(flattened_results, 'success');
        }, err_callback)
      },

      // get device details
      devices: function() {
        var device_id = req.params.device_id;
        var params = [];

        // build query
        q = "SELECT d.id, d.latitude, d.longitude, d.description, d.twitter_enabled, d.location, d.district, d.alias \
             FROM device AS d";
        if (device_id) {
          q += " WHERE id = ?";
          params = [device_id];
        }

        // query
        model.query(q, params, function(results) {
          // flatten json
          flattened_results = _.flatten(_.compact(results));
          if (type == 'geo') {
            render.geoJson(flattened_results);
          }
          else {
            render.json(flattened_results, 'success');
          }
        }, err_callback)

      }
    },
  };

  // return self controller
  return self;
}
