var mongo_client = require('mongodb'); // javascript mongodb module (library).
var db_url = 'mongodb://localhost:27017/statsbot';

var db_promise = new Promise(function (resolve, reject) {
    mongo_client.connect(db_url, function (err, res) { // async operation open connection.
        if (err)
            console.log('Unable to connect to the server', err);
        else {
            console.log("MongoDB Connection Established");
            resolve(res); // promise value returns this once async database connection is resolved (connected or failed).
        }
    });
});

module.exports = db_promise; // return the promise (export)