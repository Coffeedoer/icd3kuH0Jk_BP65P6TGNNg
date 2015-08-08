(function () {
    'use strict';

    var MONGODB_URL = 'mongodb://lampercy:12345678@ds031903.mongolab.com:31903/aftership_challenge';
    var client = require('mongodb').MongoClient

    function Mongo() {
    }

    Mongo.prototype.connect = function (callback) {
        client.connect(MONGODB_URL, function(err, db) {
            if(err) throw err;
            callback(db);
        });
    }

    module.exports = Mongo;
  
}())
