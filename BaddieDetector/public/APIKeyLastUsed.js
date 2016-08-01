var fs = require('fs');
// server-sided js; listen for http requests from ajax call via championMastery.js

function getAPIKeyLastUsedDiff(timeNow) {
    timeLastUsed = fs.readFileSync('./public/APIKeyLastUsed.txt', 'utf-8', function (err, timeLastUsed) {
        if (err)
            throw err;
        timeLastUsed = Number(timeLastUsed);
    });
    return (Math.abs(timeNow - timeLastUsed));
}

function isAPIKeyInLimits(timeDiff, rateLimit) {
    var APIKeyReadyStatus;

    if (timeDiff <= rateLimit) 
        APIKeyReadyStatus = false;
    else 
        APIKeyReadyStatus = true;

    console.log(APIKeyReadyStatus);

    return APIKeyReadyStatus;
}

function logAPIKeyUse(timeNow) {
    fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, function (err) {
        if (err)
            throw err;
    });
}

module.exports = function (app) {
    app.get('/public/APIKeyLastUsed.js', function (req, res) { // for routing do not ./
        var rateLimit = 2400 // milliseconds
        var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';

        var timeNow = new Date();
        var timeNowTotalMilliseconds = (timeNow.getSeconds() * 1000) + timeNow.getMilliseconds();
        var timeDiff = getAPIKeyLastUsedDiff(timeNowTotalMilliseconds);

        var APIKeyReadyStatus = isAPIKeyInLimits(timeDiff, rateLimit);
        var timeToWait = Math.abs(rateLimit - timeDiff) / 1000;
        var APIKeyObject;

        if (APIKeyReadyStatus)
            logAPIKeyUse(timeNowTotalMilliseconds);

        APIKeyObject = {
            'APIKey': APIKey,
            'WaitTime': timeToWait,
            'APIKeyReadyStatus': APIKeyReadyStatus
        };
        res.send(APIKeyObject);

    });
}

// ~~ APPROACH2 TO ASYNC/SYNC ~~

//fs.readFile('./public/APIKeyLastUsed.txt', function (err, timeLastUsed) {
//    if (err)
//        throw err;

//    var timeDiff = Math.abs(timeNow - timeLastUsed);

//    if (timeDiff <= 0) {
//        APIKeyReadyStatus = false;
//    }
//    else {
//        timeNow = timeNow.toString();
//        fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, 'utf-8', function (err) {
//            if (err)
//                throw err;
//        });
//        APIKeyReadyStatus = true;
//    }

//    console.log(APIKeyReadyStatus);

//    APIKeyObject = { 'APIKey': APIKey, 'APIKeyReadyStatus': APIKeyReadyStatus };
//    res.send(APIKeyObject);

//});

//    });
//}