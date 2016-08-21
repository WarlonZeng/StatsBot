var fs = require('fs');

// ~~ GLOBALS ~~ these variables are set ONCE and are set as soon as server starts up
var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';
var rateLimit = 2400; // milliseconds
var prevSearchTimeMilliseconds = new Date().getTime(); // can do -rateLimit to search as soon as server starts 
var timeToWait; // user receives this as part of the response package. 0 = 0s to wait, meaning search has been served.
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
    fs.writeFile('./APIKeyLastUsed.txt', currentSearchTime, function (err) {
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
            timeToWait = 0;
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