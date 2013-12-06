// renderers
// response based on: http://labs.omniti.com/labs/jsend (http://stackoverflow.com/questions/12806386/standard-json-api-response-format)
module.exports = function(req, res) {
  var GeoJSON = require('geojson');
  var _ = require('underscore');

  var renderers = {
    json: function(data, status) {
      output = {
          status: status,
          data: data
      };
      res.type('application/json');
      res.jsonp(output);
    },

    geoJson: function(rows) {
      // init data structure
      var data = [];
      // build geoJson feature
      _.each(rows, function(item) {
        device = {};
        device = {
          alias: item.alias,
          description: item.description,
          id: item.id,
          twitter_enabled: item.twitter_enabled,
          district: item.district,
          location: item.location,
          version: item.version,
          lat: item.latitude,
          lng: item.longitude
        }
        data.push(device);
      });

      // create geojson object
      GeoJSON.parse(data, {Point: ['lat', 'lng']}, function(geojson) {
        res.type('application/json');
        res.jsonp(geojson);
      });

    }
  }
  return renderers;
}

