module.exports = function() {
	var mysql = require('mysql');
	var config = require('../config.js');

	var db = {
		dbc: false,
		connect: function() {
			connection = mysql.createConnection({
			  host     : config.db_host,
			  user     : config.db_user,
			  password : config.db_pass,
			  database : config.db_name
			});

			// keep connection
			dbc = connection;
		},
		query: function(sql, limit, offset, res_callback, err_callback) {
		  dbc.query(sql, [limit, offset], function(err, rows) {
		  	if (err) {
		  		return err_callback('Mysql error code: ' + err.code);
		  	}
	  		res_callback(rows);
			});
		}
	}
	return db;
}
