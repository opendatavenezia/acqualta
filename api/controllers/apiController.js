//apiController.js
module.exports = function() {
	// instance model
  var _ = require('underscore');
  var mysql = require('mysql');
	var model = require('../model/data.js');
  var dbc = model.connect();

  // controller
  var self = {
    // api object
    apiAction: {
      data: function(req, res) {
        // options
        limit = (req.query.limit ? parseInt(req.query.limit) : 30);
        offset = (req.query.offset ? parseInt(req.query.offset) : 0);

        // build query
        q = "SELECT dl.*, d.latitude, d.longitude, d.description, d.twitter_enabled, d.location, d.district, d.alias FROM device_log AS dl JOIN device AS d ON dl.id_device = d.id";
        q += " LIMIT ?, ?";

        model.query(q, offset, limit, function(results) {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          });

          // flatten json
          flattened_results = _.flatten(_.compact(results));

          // create output
          output = {
            count: flattened_results.length,
            data: JSON.stringify(flattened_results)
          };

          // render
          res.end(JSON.stringify(output));
        })
      },
      geo: function(req, res) {
        res.end('geo');
      }
    },
  };

  // return self controller
  return self;
}
