google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
var championArray = [];
var championsGameVersion;
var version;
getStaticData();

function getStaticData() {
    //var object;
    $.ajax({
        async: true, //type:get
        url: '/public/getStaticChampionsGameVersion.js', // use python or php, maybe link to js to create file. javascript cannot write file to server from client side, even with ajax call. ajax call can only read.
        //dataType = "JSON",
        success: function (data) {
            //object = data;
            championsGameVersion = data;
            version = championsGameVersion.version;
        }
    });
    //return object;
}

function getAPIStatusAndKey() { // this needs to be done before data processing
    var object;
    $.ajax({
        async: false, //type:get
        url: '/public/getAPIKeyLastUsed.js', // use python or php, maybe link to js to create file. javascript cannot write file to server from client side, even with ajax call. ajax call can only read.
        //dataType = "JSON",
        success: function (data) {
            object = data;
        }
    });
    return object;
}

function getSummonerID(region, summonerName, APIKey) { // this needs to be done before data processing
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

function generateChampionData(region, summonerID, APIKey) {
    var URL = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + summonerID + "/ranked?season=SEASON2016&api_key=" + APIKey;
    $.ajax({
        async: false, // async here, dont need to wait
        url: URL,
        dataType: "JSON",
        success: function (data) {
            var totalRankedGames = 0;
            var championName = "";
            for (var i in data.champions) {
                if (data.champions[i].id == 0) {
                    totalRankedGames = data.champions[i].stats.totalSessionsPlayed; break;
                }
            }
            for (var i in data.champions) {
                if (data.champions[i].id == 0)
                    continue;
                for (var j in championsGameVersion.data) {
                    if (data.champions[i].id == championsGameVersion.data[j].id) {
                        championName = championsGameVersion.data[j].key; break;
                    }
                }
                championArray.push([
                    ((data.champions[i].stats.totalSessionsPlayed / totalRankedGames) * 100),
                    ((data.champions[i].stats.totalSessionsWon / data.champions[i].stats.totalSessionsPlayed) * 100),
                    championName
                ]);
            }
        }
    });
    return championArray;
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

function requestSummonerData() { // "main" function
    var region = "na";
    var APIKeyObject = getAPIStatusAndKey();
    var thisURL = window.location.href;

    if (APIKeyObject.APIKeyReadyStatus) {
        //var summonerName = (((document.getElementById('summonerName')).value).toLowerCase().replace(/ /g, ''));
        //var summonerName = (document.getElementById('summonerName').value).toLowerCase();

        summonerName = ((gup("summoner", thisURL)).toLowerCase()).replace(/\+/g, ' ');
        console.log(summonerName);
        var summonerID = getSummonerID(region, summonerName, APIKeyObject.APIKey);
        return generateChampionData(region, summonerID, APIKeyObject.APIKey);
    }
    else {
        alert('API key not ready, try again in ' + APIKeyObject.WaitTime + 's');
    }
}



function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Pick Rate');
    data.addColumn('number', 'Win Rate');
    data.addColumn({ type: 'string', role: 'tooltip' });
    //data.addColumn({ type: 'string', role: 'tooltip' });
    championArray = requestSummonerData();
    data.addRows(championArray);

    var options = {
        title: 'Pick Rate vs. Win Rate Comparison',
        hAxis: {
            gridlines: { color: '#000000' },
            format: '#\'%\'',
            colors: ['#000000'],
            title: 'Pick Rate',
            titleTextStyle: {
                color: '#000000',
                bold: true
            },
            textStyle: {
                color: '#000000',
                bold: true
            },
            minValue: 0,
        },
        vAxis: {
            gridlines: { color: '#000000' },
            format: '#\'%\'',
            title: 'Win Rate',
            titleTextStyle: {
                color: '#000000',
                bold: true
            },
            textStyle: {
                color: '#000000',
                bold: true
            },
            minValue: 0,
            maxValue: 100
        },
        chartArea: {
            height: "80%",
            width: "85%"
        },
        legend: 'none',
        backgroundColor: 'transparent',
        crosshair: { trigger: 'both' },
        dataOpacity: 0
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    function placeMarkers(dataTable) { // google charts create SVG elements with object properity 'circle'. 
        var i = 0;
        var cli = this.getChartLayoutInterface();
        var chartArea = cli.getChartAreaBoundingBox();

        for (var i = 0; i < championArray.length; i++) {
            var link = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + championArray[i][2] + ".png";
            var img = document.createElement('img');
            $('#chart_div').append(img);
            img.src = link;
            img.height = 16;
            img.width = 16;
            img.style = (
                'border-radius: 50%; ' +
                'position: absolute; ' +
                'left: ' + (Math.floor(cli.getXLocation(dataTable.getValue(i, 0))) - 7.5) + 'px; ' +
                'top: ' + (Math.floor(cli.getYLocation(dataTable.getValue(i, 1))) - 7.5) + 'px; ' +
                'pointer-events: none'
            );
        }
    }

    google.visualization.events.addListener(chart, 'ready',
        placeMarkers.bind(chart, data));
    chart.draw(data, options);
}