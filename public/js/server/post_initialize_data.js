// ------------------------- SERVER FILE -------------------------
// Clients will not be able to see the key.

var request = require('request'); // javascript request module (library).

var static_data_promise = require('./get_static_data');  // retrieve promise from https request.
var db_promise = require('./initialize_database'); // retrieve database promise from async database operation.
var service = require('./check_service.js'); // retrieve custom+ queue.

var api_key = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7'; // critical sensitive data - api key
var static_data = {}; // container variable for static data 
var collection; // container variable for database collection
var summoner_id_query_value = { '$exists': true }; // it is a fixed value that is part of every query object. 

static_data_promise.then(function (res) { // unload the static data promise
    static_data = res;
});

db_promise.then(function (res) { // unload the database promise. connection to DB is TCP just like socketing. very expensive call, makes new thread on mongodb every time. that is why we reuse connection via server initialization.
    collection = res.collection('summoners'); // select summoners collection inside statsbot database
    collection.find().toarray(function (err, docs) {
        console.log(docs);
    }); // see what we have in store at server initialization.
});

function process_ranked_data(data) { // custom processing!

    var ranked_data_champion_wins_picks = [];
    var ranked_data_champion_wins_avg_kda = [];
    var ranked_data_champion_wins_avg_kills = [];
    var ranked_data_champion_wins_avg_deaths = [];
    var ranked_data_champion_wins_avg_assists = [];

    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Game Statistics vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv


    var ranked_games_total = 0;
    var champion_wins = 0; // website's main vertical statistic.

    var champion_games_played = 0;
    var champion_kills = 0;
    var champion_deaths = 0;
    var champion_assists = 0;
    var champion_name = '';

    var champion_win_rate = 0; // wins / total champion games played. website's main computed vertical statistic.

    var champion_pick_rate = 0; // total champion games  played / ranked games total
    var champion_avg_kda = 0; // (kills + assists) / total champion games played
    var champion_avg_kills = 0; // kills / total champion games played
    var champion_avg_deaths = 0; // deaths / total champion games played
    var champion_avg_assists = 0; // assists / total champion games played


    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Game Statistics ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    for (var i in data.champions) {
        if (data.champions[i].id == 0) {
            ranked_games_total = data.champions[i].stats.totalSessionsPlayed; break;
        }
    }

    for (var i in data.champions) {
        if (data.champions[i].id == 0)
            continue;

        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Game Statistics vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv


        champion_wins = data.champions[i].stats.totalSessionsWon; // total wins on that champion

        champion_games_played = data.champions[i].stats.totalSessionsPlayed; // total games on that champion
        champion_kills = data.champions[i].stats.totalChampionKills;
        champion_deaths = data.champions[i].stats.totalDeathsPerSession;
        champion_assists = data.champions[i].stats.totalAssists;
        champion_name = static_data.data[data.champions[i].id].key; // name of champion

        champion_pick_rate = (champion_games_played / ranked_games_total) * 100; // win rate in %
        champion_win_rate = (champion_wins / champion_games_played) * 100; // pick rate in %
        champion_avg_kda = (champion_kills + champion_assists) / champion_deaths;
        champion_avg_kills = champion_kills / champion_games_played;
        champion_avg_deaths = champion_deaths / champion_games_played;
        champion_avg_assists = champion_assists / champion_games_played;

        //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Game Statistics ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        ranked_data_champion_wins_picks.push([champion_pick_rate, champion_win_rate, champion_name]); // format: h, v, t = horizontal, vertical, tooltip string
        ranked_data_champion_wins_avg_kda.push([champion_avg_kda, champion_win_rate, champion_name]);
        ranked_data_champion_wins_avg_kills.push([champion_avg_kills, champion_win_rate, champion_name]);
        ranked_data_champion_wins_avg_deaths.push([champion_avg_deaths, champion_win_rate, champion_name]);
        ranked_data_champion_wins_avg_assists.push([champion_avg_assists, champion_win_rate, champion_name]);

    }
    return {
        ranked_data_champion_wins_picks,
        ranked_data_champion_wins_avg_kda,
        ranked_data_champion_wins_avg_kills,
        ranked_data_champion_wins_avg_deaths,
        ranked_data_champion_wins_avg_assists
    }; // organized
}

module.exports = function (app) { // embrace async callback hell
    app.post('/public/js/server/post_initialize_data.js', function (req, res) {
        var region = req.body.region; // summoner's region
        var summoner_name = req.body.summoner_name; // summoner's name
        var summoner_id = 0;
        var summoner_id_query = {}; // container for queries (is used and recycled)
        summoner_id_query[summoner_name] = summoner_id_query_value; // { 'yinhei' : { $exists : true } }

        collection.findOne(summoner_id_query, function (err, doc) {
            if (err) throw err;
            else if (doc == null) {
                if (service.enqueue().status) { // enqueue for 1st api call: get id
                    var summoner_id_url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summoner_name + '?api_key=' + api_key; // defined with Client input region, name

                    request({ url: summoner_id_url, json: true }, function (error, response, body) { // 1st async func
                        if (error) throw (error);
                        else if (!error && response.statusCode === 200) { // may return bad request if specified name doesn't exist (typo: Client's fault).
                            summoner_id = body[summoner_name].id;

                            summoner_id_query[summoner_name] = summoner_id;
                            collection.update(summoner_id_query, summoner_id_query, { upsert: true }); // insert into database if not found

                            if (service.enqueue().status) { // enqueue for 2nd api call: get ranked data
                                var ranked_data_url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/stats/by-summoner/' + summoner_id + '/ranked?season=SEASON2016&api_key=' + api_key;
                                //console.log(service.line);

                                request({ url: ranked_data_url, json: true }, function (error, response, body) { // 2nd async func, rqeuires information from 1st async to send
                                    if (error) throw (error);
                                    else if (!error && response.statusCode === 200) {
                                        var ranked_data = process_ranked_data(body);
                                        res.send({ ranked_data_processed: ranked_data, version: static_data.version });
                                    }
                                });
                            }
                            else
                                alert('API key not ready, try again in ' + service.enqueue().wait + 's');
                        }
                    });
                }
                else
                    alert('API key not ready, try again in ' + service.enqueue().wait + 's');
            }
            else {
                summoner_id = doc[summoner_name];
                if (service.enqueue().status) { // enqueue for 1st api call: get ranked data
                    var ranked_data_url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/stats/by-summoner/' + summoner_id + '/ranked?season=SEASON2016&api_key=' + api_key;
                    //console.log(service.line);

                    request({ url: ranked_data_url, json: true }, function (error, response, body) { // 1st async func
                        if (error) throw (error);
                        else if (!error && response.statusCode === 200) {
                            var ranked_data = process_ranked_data(body);
                            res.send({ ranked_data_processed: ranked_data, version: static_data.version });
                        }
                    });
                }
                else
                    alert('API key not ready, try again in ' + service.enqueue().wait + 's');
            }
        });
    });
}