'use strict';

(function () {
    'use strict';
    
    var TIMEOUT = 10;
    var bean = require('./bean');

    function Consumer() {
        var _this = this;
        bean.then(function(client) {
            _this.client = client;
            client.watch('lampercy', function(err, numwatched) {});
            client.ignore('default', function(err, numwatched) {});
            _this.reserve();
        });
    }

    Consumer.prototype.reserve = function () {
        var _this = this;

        this.client.reserve_with_timeout(TIMEOUT, function(err, jobid, payload) {
            if (err == 'TIMED_OUT') {
                _this.reserve();

            } else {
                var seed = JSON.parse(payload);
                _this.client.destroy(jobid, function(err) {});
                _this.reserve();
            }
        });
    }

    var consumer = new Consumer();

}())
