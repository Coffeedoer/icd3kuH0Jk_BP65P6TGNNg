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
                    _this.client.destroy(jobid, function(err) {});
                    _this.reserve();

                }, function (err) {
                });
            }
        });
    }

    var consumer = new Consumer();

}())
