// ------------------------- SERVER FILE -------------------------
// STATIC API does not count towards API key.. it is initialized at server start and the only thing we're exporting is a start-up made data structure.
// Clients will not be able to see the key.

var request = require('request');
var api_key = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';
var static_data_url = 'https://' + 'global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=' + api_key;
var static_data = { data: {} };

var static_data_promise = new Promise(function (resolve, reject) {

    request({ url: static_data_url, json: true }, function (error, response, body) {
        var id;
        var title;
        var name;
        var key;

        if (!error && response.statusCode === 200) {
            Object.keys(body.data).forEach(function (i) {
                id = body.data[i].id;
                title = body.data[i].title;
                name = body.data[i].name;
                key = body.data[i].key;

                static_data.data[id.toString()] = {
                    title: title,
                    name: name,
                    key: key,
                }
            });
            Object.keys(body.version).forEach(function () {
                static_data.version = body.version;
            });    
        }
        resolve(static_data);
    });

});

module.exports = static_data_promise;