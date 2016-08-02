var fs = require('fs');

// ~~ GLOBALS ~~ these variables are set ONCE and are set as soon as server starts up
var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';
var rateLimit = 2400; // milliseconds
var prevSearchTimeMilliseconds = new Date().getTime(); // can do -rateLimit to search as soon as server starts 
var timeToWait = 0; // user receives this as part of the response package. 0 = 0s to wait, meaning search has been served.
var APIKeyObject;

function getLastSearchTimeDiff(prevSearchTimeMilliseconds, currentSearchTimeMilliseconds) {
    return Math.abs(prevSearchTimeMilliseconds - currentSearchTimeMilliseconds);
}

function isAPIKeyInLimits(timeDiff, rateLimit) {
    var APIKeyReadyStatus;
    if (timeDiff < rateLimit) 
        APIKeyReadyStatus = false;
    else 
        APIKeyReadyStatus = true;
    return APIKeyReadyStatus;
}

function logAPIKeyUse(currentSearchTime) {
    currentSearchTime = currentSearchTime.toLocaleString(); // intellisense won't detect it but since the parameter is a date object, .toLocaleString works.
    fs.writeFile('./public/APIKeyLastUsed.txt', currentSearchTime, function (err) {
        if (err)
            throw err;
    });
}

module.exports = function (app) { // EVERYTIME THIS SCRIPT IS CALLED from browser
    app.get('/public/APIKeyLastUsed.js', function (req, res) { // for routing do not ./

        var currentSearchTime = new Date();
        var currentSearchTimeMilliseconds = currentSearchTime.getTime();

        console.log(prevSearchTimeMilliseconds); // output prev
        console.log(currentSearchTimeMilliseconds); // output current

        var timeDiff = getLastSearchTimeDiff(prevSearchTimeMilliseconds, currentSearchTimeMilliseconds);
        console.log(timeDiff); // >2400 or <2400;

        prevSearchTimeMilliseconds = currentSearchTimeMilliseconds; // prev = curr to 
        var APIKeyReadyStatus = isAPIKeyInLimits(timeDiff, rateLimit);
        console.log(APIKeyReadyStatus); // <2400 = false; >2400 = true;

        if (APIKeyReadyStatus) {
            logAPIKeyUse(currentSearchTime); // logs current time
        }
        else
            timeToWait = Math.abs(rateLimit - timeDiff) / 1000;

        APIKeyObject = {
            'APIKey': APIKey,
            'WaitTime': timeToWait,
            'APIKeyReadyStatus': APIKeyReadyStatus
        };

        res.send(APIKeyObject);

    });
}

// ~~ APPROACH1 ~~

//function getAPIKeyLastUsedDiff(timeNow) {
//    timeLastUsed = fs.readFileSync('./public/APIKeyLastUsed.txt', 'utf-8', function (err, timeLastUsed) {
//        if (err)
//            throw err;
//        timeLastUsed = Number(timeLastUsed);
//    });
//    return (Math.abs(timeNow - timeLastUsed));
//}

//function isAPIKeyInLimits(timeDiff, rateLimit) {
//    var APIKeyReadyStatus;

//    if (timeDiff <= rateLimit)
//        APIKeyReadyStatus = false;
//    else
//        APIKeyReadyStatus = true;

//    console.log(APIKeyReadyStatus);

//    return APIKeyReadyStatus;
//}

//function logAPIKeyUse(timeNow) {
//    fs.writeFile('./public/APIKeyLastUsed.txt', timeNow, function (err) {
//        if (err)
//            throw err;
//    });
//}

//module.exports = function (app) {
//    app.get('/public/APIKeyLastUsed.js', function (req, res) { // for routing do not ./
//        var rateLimit = 2400 // milliseconds
//        var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';


//        var timeNow = new Date();
//        var timeNowTotalMilliseconds = (timeNow.getSeconds() * 1000) + timeNow.getMilliseconds();
//        var timeDiff = getAPIKeyLastUsedDiff(timeNowTotalMilliseconds);

//        var APIKeyReadyStatus = isAPIKeyInLimits(timeDiff, rateLimit);
//        var timeToWait = Math.abs(rateLimit - timeDiff) / 1000;
//        var APIKeyObject;

//        if (APIKeyReadyStatus)
//            logAPIKeyUse(timeNowTotalMilliseconds);

//        APIKeyObject = {
//            'APIKey': APIKey,
//            'WaitTime': timeToWait,
//            'APIKeyReadyStatus': APIKeyReadyStatus
//        };
//        res.send(APIKeyObject);

//    });
//}

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