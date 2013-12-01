// renderers
// response based on: http://labs.omniti.com/labs/jsend (http://stackoverflow.com/questions/12806386/standard-json-api-response-format)
module.exports = function(req, res) {
	var renderers = {
		json: function(data, status) {
 			output = {
          status: status,
          data: data
      };
      res.type('application/json');
      res.jsonp(output);
		},
		geoJson: function(data, status) {

		}
	}
	return renderers;
}

