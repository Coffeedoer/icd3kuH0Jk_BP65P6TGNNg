'use strict';

var bean = require('./bean');

var payload = {
    "from": "HKD",
    "to": "USD"
};

bean.then(function(bean) {
    bean.put(0, 0, 0, JSON.stringify(payload), function(err, jobid) {});
    bean.quit();
});
