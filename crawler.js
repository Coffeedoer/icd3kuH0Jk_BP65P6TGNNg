(function () {
    'use strict';

    var Request = require('request');
    var Promise = require('bluebird');

    function Crawler(from_currency, to_currency) {
        this.request_url = [
            "http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=",
            from_currency,
            to_currency,
            "=X" 
        ].join("");
    }

    Crawler.prototype.start = function () {
        var resolver = Promise.pending();
        Request(this.request_url , function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var rate = body.split(',')[1];
                rate = Math.round(rate * 100) /100;
                rate = String(rate);
                return resolver.resolve(rate);

            } else {
              resolver.reject(error);
            }

        });
        return resolver.promise;
    }

    module.exports = Crawler;
  
}())
