(function () {
    'use strict';
    
    var TIMEOUT = 1;
    var co = require('co');
    var Promise = require('bluebird');

    var Crawler = require('./crawler');
    var bean = require('./bean');
    var Mongo = require('./mongo');

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
                
                co(function* () {
                    var crawler = new Crawler(seed.from, seed.to);
                    var rate = yield crawler.start();
                    var db = yield new Mongo().db();
                    var collection = db.collection('exchange_rates')
                      
                    collection.insert({
                        "from": seed.from,
                        "to": seed.to,
                        "created_at": new Date(),
                        "rate": rate
                    }, function(err, docs) {
                    })

                }).then(function (value) {
                    seed.success_count++;
                    _this.client.destroy(jobid, function(err) {});

                    if (seed.success_count < 10) {
                        _this.client.put(0, 60, 0, JSON.stringify(seed), 
                            function(err, jobid) {});
                    }

                    _this.reserve();

                }, function (err) {
                    seed.fail_count++;
                    _this.client.destroy(jobid, function(err) {});                    

                    if (seed.fail_count < 3) {
                        _this.client.put(0, 3, 0, JSON.stringify(payload), 
                            function(err, jobid) {});
                    }

                    _this.reserve();
                });
            }
        });
    }

    var consumer = new Consumer();

}())
