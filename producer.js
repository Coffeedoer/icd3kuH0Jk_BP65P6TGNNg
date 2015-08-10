'use strict';
var co = require('co');
var Promise = require('bluebird');

co(function* () {
    var bean = yield require('./bean')

    function chooseTube() {
        var resolver = Promise.pending();
        bean.use('lampercy', function(err, tubename) {
            if (err) {
                resolver.reject(err);
            } else {
                resolver.resolve();
            }
        });
        return resolver.promise;
    };

    yield chooseTube();
    return bean;

}).then(function(bean) {

  var payload = {
      "from": "HKD",
      "to": "USD",
      "success_count": 0,
      "fail_count": 0
  };

  bean.put(0, 0, 0, JSON.stringify(payload), function(err, jobid) {});
  bean.quit();

}).catch(function(err) {
    console.log(err);
});
