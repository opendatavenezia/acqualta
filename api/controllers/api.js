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
      init: function(req, res, next) {
        // init data renderers
        render = require('../views/render')(req, res);

        // options
        limit = (req.query.limit ? parseInt(req.query.limit) : 30);
        offset = (req.query.offset ? parseInt(req.query.offset) : 0);

        // define error callback
        err_callback = function(err) {
          render.json(err, 'error')
        }

        // follow next call
        next();
      },
      data: function(req, res) {
        // build query
        q = "SELECT dl.*, d.latitude, d.longitude, d.description, d.twitter_enabled, d.location, d.district, d.alias FROM device_log AS dl JOIN device AS d ON dl.id_device = d.id";
        q += " LIMIT ?, ?";

        model.query(q, offset, limit, function(results) {
          // flatten json
          flattened_results = _.flatten(_.compact(results));
          render.json(flattened_results, 'success');
        }, err_callback)
      },
      geo: function(req, res) {
        res.end('geo');
      }
    },
  };

  // return self controller
  return self;
}
