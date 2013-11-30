var dataModel = function() {
	var mysql = require('mysql');
	var config = require('../config.js');
	var dbc = false;

	// connect
	this.connect = function() {
		connection = mysql.createConnection({
		  host     : config.db_host,
		  user     : config.db_user,
		  password : config.db_pass,
		  database : config.db_name
		});

		// handle errors
		connection.on('error', function(err) {
  		console.log(err.code); // 'ER_BAD_DB_ERROR'
  		exit(0);
		});

		// keep connection
		this.dbc = connection;
		return this.dbc;
	}

	this.query = function(sql, limit, offset, callback) {
		this.dbc.query(sql, [limit, offset], function(err, results) {
  		callback(results);
		});
	}
}
module.exports = new dataModel();