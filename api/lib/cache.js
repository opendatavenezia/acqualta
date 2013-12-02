module.exports = function() {
  var memcache = require('mc');
  var config = require('../config.js');

  var cache = {
    connect: function(callback, err_callback) {
      client = new memcache.Client();
      client.connect(function() {
        callback(client);
      });

    },
    query: function(sql, params, res_callback, err_callback) {
      var md5_query = md5(sql + params.join('-'));
      if (cache.get(md5_query)) {
        console.log('cache hit');
        data = cache.get(md5_query);
        res_callback(data);
      }
      else {
        console.log('cache miss');
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

  return cache;
}
