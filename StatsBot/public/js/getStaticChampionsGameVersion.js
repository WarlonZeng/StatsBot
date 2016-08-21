// ~~ GLOBALS ~~ these variables are set ONCE and are set as soon as server starts up
var https = require('https');
var APIKey = 'f7ac9407-3955-4bf9-81ab-42b0945ab1f7';
var URL = "https://" + "global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=" + APIKey;
var championsGameVersionData;

https.get(URL, (res) => {
    res.setEncoding('utf8');
    res.on('data', (d) => {
        //version = d;

        //str1pos = version.indexOf('"') + 1;
        //str1 = version.substr(str1pos, 10);
        //str2pos = str1.indexOf('"');
        //version = version.substr(str1pos, str2pos)
        //return version;
        championsGameVersionData = JSON.parse(d);
        return championsGameVersionData;
    });
});

module.exports = function (app) { // EVERYTIME THIS SCRIPT IS CALLED from browser
    app.get('/public/getStaticChampionsGameVersion.js', function (req, res) { // for routing do not ./
        res.send(championsGameVersionData);
    });
}