function getSummonerID(region, summonerName, APIKey) {
    var URL = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + summonerName + "?api_key=" + APIKey;
    var summonerID;

    $.ajax({
        async: false, // This will make call synchronous
        url: URL,
        dataType: "JSON",
        success: function (data) {
            summonerID = data[summonerName]['id'];
        }
    });
    return summonerID;
}

function getSummonerCoops(region, summonerID, APIKey) {
    var URL = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + summonerID + "/summary?season=SEASON2016&api_key=" + APIKey;

    var coops5x5 = 0;
    var coops3x3 = 0;
    var coops;
    var timeSinceLastCoop5x5 = 0;
    var timeSinceLastCoop3x3 = 0;
    var timeSinceLastCoop;
    var rankedSoloWins = 0;
    var rankedSoloLosses = 0;
    var rankedSolos;
    var timeSinceLastRankedSolo = 0;
    var negativeWinRate;

    $.ajax({
        async: true, // async here, dont need to wait
        url: URL,
        dataType: "JSON",
        success: function (data) {
            //data = data['playerStatSummaries'];
            //data = data.playerStatSummaries;
            //var size = Object.keys(data).length;
            //for (var i = 0; i < size; i++) {
            for (var i in data.playerStatSummaries) {
                if (data.playerStatSummaries[i].playerStatSummaryType == 'CoopVsAI') {
                    coops5x5 = data.playerStatSummaries[i].wins; // coops
                    timeSinceLastCoop5x5 = data.playerStatSummaries[i].modifyDate;
                }   
                else if (data.playerStatSummaries[i].playerStatSummaryType == 'CoopVsAI3x3') {
                    coops3x3 = data.playerStatSummaries[i].wins;
                    timeSinceLastCoop3x3 = data.playerStatSummaries[i].modifyDate;
                }
                else if (data.playerStatSummaries[i].playerStatSummaryType == 'RankedSolo5x5') {
                    rankedSolosWins = data.playerStatSummaries[i].wins; // rankeds
                    rankedSolosLosses = data.playerStatSummaries[i].losses;
                    timeSinceLastRankedSolo = data.playerStatSummaries[i].modifyDate;
                }
            }

            coops = coops3x3 + coops5x5; // coops played
            rankedSolos = rankedSolosWins + rankedSolosLosses;

            if (coops != 0) {
                if (timeSinceLastCoop5x5 > timeSinceLastCoop3x3) {
                    timeSinceLastCoop = new Date(timeSinceLastCoop5x5);
                    timeSinceLastCoop = timeSinceLastCoop.toLocaleString();
                } else {
                    timeSinceLastCoop = new Date(timeSinceLastCoop3x3);
                    timeSinceLastCoop = timeSinceLastCoop.toLocaleString();
                }
            } else {
                timeSinceLastCoop = 'No games played this season';
            }

            if (rankedSolos != 0) {
                timeSinceLastRankedSolo = new Date(timeSinceLastRankedSolo);
                timeSinceLastRankedSolo = timeSinceLastRankedSolo.toLocaleString();
            } else {
                timeSinceLastRankedSolo = 'No games played this season';
            }

            // ~~ NEGATIVE WIN RATE RANKED? ~~
            if (rankedSolosWins < rankedSolosLosses) {
                negativeWinRate = true;
            } else {
                negativeWinRate = false;
            }

            $('#coops').text(coops);
            $('#rankedSolos').text(rankedSolos);
            $('#timeSinceLastCoop').text(timeSinceLastCoop);
            $('#timeSinceLastRankedSolo').text(timeSinceLastRankedSolo);
            $('#negativeWinRate').text(negativeWinRate);
        }
    });
}

function getAPIStatusAndKey() {
    var object;
    $.ajax({
        async: false, //type:get
        url: '/public/APIKeyLastUsed.js', // use python or php, maybe link to js to create file. javascript cannot write file to server from client side, even with ajax call. ajax call can only read.
        //dataType = "JSON",
        success: function (data) {
            object = data;
        }
    });
    return object;
}

function requestSummonerData() { // "main" function
    var region = "na";
    var APIKeyObject = getAPIStatusAndKey();
    //var APIKey = APIKeyObject['APIKey'];
    //var timeToWait = APIKeyObject['WaitTime'];
    //var isAPIKeyReady = APIKeyObject['APIKeyReadyStatus'];

    if (APIKeyObject.APIKeyReadyStatus) {
        var summonerName = (((document.getElementById('summonerName')).value).toLowerCase().replace(/ /g, ''));
        var summonerID = getSummonerID(region, summonerName, APIKeyObject.APIKey);

        console.log(summonerName);

        getSummonerCoops(region, summonerID, APIKeyObject.APIKey);

        console.log('Served: ' + summonerName);
    }
    else {
        alert('API key not ready, try again in ' + APIKeyObject.WaitTime + 's');
    }   
}