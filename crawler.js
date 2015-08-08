#! /usr/bin/env node

(function () {
    'use strict';

    var request = require('request');
    var REQUEST_URL = "http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=HKDUSD=X";

    function Crawler() {
    }

    Crawler.prototype.start = function () {
        request(REQUEST_URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        });
    }

    module.exports = Crawler;
  
}())
