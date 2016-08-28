// ------------------------- SERVER FILE -------------------------
// Clients will not be able to see the key.

var data = require('./get_static_data'); 
var request = require('request');
var service = require('./check_service.js');

var api_key = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';
var static_data = {};

data.then(function (res) {
    static_data = res;
});



function process_ranked_data(ranked_data) {
    var total_ranked_games = 0;
    var ranked_data_processed = [];

    for (var i in ranked_data.champions) {
        if (ranked_data.champions[i].id == 0) {
            total_ranked_games = ranked_data.champions[i].stats.totalSessionsPlayed; break;
        }
    }

    for (var i in ranked_data.champions) {
        if (ranked_data.champions[i].id == 0)
            continue;
        // champion name = static_data.data[ranked_data.champions[i].id]).key;
        ranked_data_processed.push([
            ((ranked_data.champions[i].stats.totalSessionsPlayed / total_ranked_games) * 100),
            ((ranked_data.champions[i].stats.totalSessionsWon / ranked_data.champions[i].stats.totalSessionsPlayed) * 100),
            ((static_data.data[ranked_data.champions[i].id]).key)
        ]);
    }
    return ranked_data_processed;
}

module.exports = function (app) { // embrace async callback hell
    app.post('/public/js/server/post_initialize_data.js', function (req, res) {
        var region = req.body.region;
        var summoner_name = req.body.summoner_name;
        var summoner_id = 0;

        if (service.enqueue().status) { // enqueue for 1st api call: get id
            var summoner_id_url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summoner_name + '?api_key=' + api_key;

            request({ url: summoner_id_url, json: true }, function (error, response, body) { // 1st async func
                if (!error && response.statusCode === 200) {
                    summoner_id = body[summoner_name].id;
                    var ranked_data_url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/stats/by-summoner/' + summoner_id + '/ranked?season=SEASON2016&api_key=' + api_key;

                    if (service.enqueue().status) { // enqueue for 2nd api call: get ranked data
                        console.log(service.line);

                        request({ url: ranked_data_url, json: true }, function (error, response, body) { // 2nd async func
                            var ranked_data_processed = process_ranked_data(body);
                            res.send({ ranked_data_processed: ranked_data_processed, version: static_data.version });
                        });
                    }
                    else
                        alert('API key not ready, try again in ' + service.enqueue().wait + 's');
                }
            });
        }
        else
            alert('API key not ready, try again in ' + service.enqueue().wait + 's');
    });
}