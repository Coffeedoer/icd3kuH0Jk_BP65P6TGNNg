(function () {
    'use strict';

    var MONGODB_URL = 'mongodb://lampercy:12345678@ds031903.mongolab.com:31903/aftership_challenge';
    var Client = require('mongodb').MongoClient
    var Promise = require('bluebird');

    function Mongo() {}

    Mongo.prototype.db = function () {
        var resolver = Promise.pending();
        Client.connect(MONGODB_URL, function(err, db) {
            if(err){
                resolver.reject(err);
            };

            resolver.resolve(db);
        });

        return resolver.promise;
    }

    module.exports = Mongo;
  
}())
