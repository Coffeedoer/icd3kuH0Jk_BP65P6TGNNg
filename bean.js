(function () {
    'use strict';

    var Fivebeans = require('fivebeans');
    var Promise = require('bluebird');

    var client = new Fivebeans.client('localhost', 11300);
    var resolver = Promise.pending();

    client.on('connect', function() {
        resolver.resolve(client);
    });

    client.on('error', function(err) {
        resolver.reject(err);
    });

    client.connect();
    module.exports = resolver.promise;

}())
