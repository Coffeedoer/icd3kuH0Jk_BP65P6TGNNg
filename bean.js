(function () {
    'use strict';

    var Fivebeans = require('fivebeans');
    var Promise = require('bluebird');

    var client = new Fivebeans.client('localhost', 11300);
    var resolver = Promise.pending();

    client.on('connect', function() {
      client.use('lampercy', function(err, tubename) {});
      resolver.resolve(client);
    });

    client.connect();
    module.exports = resolver.promise;

}())
