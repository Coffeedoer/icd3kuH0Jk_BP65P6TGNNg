'use strict';

var bean = require('./bean');

var payload = {
    "from": "HKD",
    "to": "USD",
    "success_count": 0,
    "fail_count": 0
};

bean.then(function(bean) {
    bean.put(0, 0, 0, JSON.stringify(payload), function(err, jobid) {});
    bean.quit();
});
