module.exports = function() {
  var mysql = require('mysql');
  var config = require('../config.js');
  var md5 = require('MD5');
  var cache = require("ncache");

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
    // very basic memory cache implemented
    query: function(sql, params, res_callback, err_callback) {
      var md5_query = md5(sql + params.join('-'));
      if (cache.get(md5_query)) {
        data = cache.get(md5_query);
        res_callback(data);
      }
      else {
        dbc.query(sql, params, function(err, rows) {
          if (err) {
            return err_callback('Mysql error code: ' + err.code);
          }
          cache.set(md5_query, rows, config.cache_timeout);
          res_callback(rows);
        });
      }
    }
  }
  return db;
}
