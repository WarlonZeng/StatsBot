var fs = require('fs');
//var app = require('express');

// server-sided js; listen for http requests from ajax call via championMastery.js

module.exports = function (app) {
    app.get('/public/APIKeyLastUsed.js', function (req, res) { // for routing do not ./
        var timeNow = new Date();

        //fs.readFile('./public/APIKeyLastUsed', function (err, timeLastUsed) {
        //    // error handle
        //    if (err)
        //        console.log(err);
        //    console.log(timeLastUsed);

        //    // true = api key ready 
        //    // false = api key not ready
        //    // if ready = log time, respond true
        //    // if not ready = respond false.
        //    var timeDiff = abs(timeNow - timeLastUsed);
        //    if (timeDiff <= 0) {
        //        res.send(false);
        //        console.log('API key not ready to use yet');
        //    }
        //    else {
        //        fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, function (err) {
        //            if (err) {
        //                console.log(err);
        //            }
        //            console.log('API key is ready to use');       
        //        });
        //        res.send(true);
        //    }

        //});
        //res.send(timeNow);
        fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('API key is ready to use');
        });

    });
};

//fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, function (err) {
//    if (err) {
//        console.log(err);
//    }
//    console.log('API key is ready to use');
//});
//res.send(true);