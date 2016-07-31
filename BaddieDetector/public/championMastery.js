function getSummonerID(region, summonerName, APIKey) {
    var URL = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + summonerName + "?api_key=" + APIKey;
    var summonerID;

    $.ajax({
        async: false, // This will make call synchronous
        url: URL,
        dataType: "json",
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
        dataType: "json",
        success: function (data) {
            data = data['playerStatSummaries'];
            var size = Object.keys(data).length;

            for (var i = 0; i < size; i++) {
                if (data[i]['playerStatSummaryType'] == 'CoopVsAI') {
                    coops5x5 = data[i]['wins']; // coops
                    timeSinceLastCoop5x5 = data[i]['modifyDate'];
                }
                else if (data[i]['playerStatSummaryType'] == 'CoopVsAI3x3') {
                    coops3x3 = data[i]['wins'];
                    timeSinceLastCoop3x3 = data[i]['modifyDate'];
                }
                else if (data[i]['playerStatSummaryType'] == 'RankedSolo5x5') {
                    rankedSolosWins = data[i]['wins']; // rankeds
                    rankedSolosLosses = data[i]['losses'];
                    timeSinceLastRankedSolo = data[i]['modifyDate'];
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

//function getAPIKeyLastUsed() {
//    $.ajax({
//        async: true,
//        url: '/APIKeyLastUsed.txt',
//        dataType: "string",
//        success: function (data) {
//            console.alert(data);
//        }
//    });
//}

function setAPIKeyLastUsed() {
    $.ajax({
        async: true, //type:get
        url: '/public/APIKeyLastUsed.js', // use python or php, maybe link to js to create file. javascript cannot write file to server from client side, even with ajax call. ajax call can only read.
        success: function (data) {
            console.log(data)
        }
    });
}

function requestSummonerData() { // "main" function
    var region = "na";
    var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';

    setAPIKeyLastUsed();

    var summonerName = ((document.getElementById('summoner_name')).value).toLowerCase();
    summonerName = summonerName.replace(/ /g, '')
    console.log(summonerName);

    //var summonerID = getSummonerID(region, summonerName, APIKey); // get summoner's ID. needed for summoner's champion data.
    var summonerID = getSummonerID(region, summonerName, APIKey);
    getSummonerCoops(region, summonerID, APIKey);
}