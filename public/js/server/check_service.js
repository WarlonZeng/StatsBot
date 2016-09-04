// ------------------------- SERVER FILE -------------------------

//import Queue from '../data_structures/Queue.js';
var Queue = require('../data_structures/Queue.js');
var fs = require('fs');
var service = new Queue();

function log_client(time) {
    time = time.toLocaleString(); // intellisense won't detect it but since the parameter is a date object, .toLocaleString works.
    fs.writeFile('./APIKeyLastUsed.txt', time, function (err) {
        if (err)
            throw err;
    });
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { // var foo = require('./check_service'), foo.enterQueue() is possible.

    front: function () {
        return service.front;
    },

    back: function () {
        return service.back;
    },

    line: service.line,

    enqueue: function () { // custom enqueue - service enqueue.
        time_now = new Date();
        time_now_ms = time_now.getTime();
        var status = {};

        if ((service.size > 10) && (abs(time_now_ms - service.line.front) < 10000)) { // if within 10 in 10
            status.status = false;
            status.wait = (((service.line.front + 10000) - time_now_ms) / 1000);
            return status;
        }
        else if ((service.size > 500) && (abs(time_now_ms - service.line.front) < 600000)) { // if within 500 in 600
            status.status = false;
            status.wait = (((service.line.front + 600000) - time_now_ms) / 1000);
            return status;
        }
        else {
            service.enqueue(time_now_ms);
            //console.log(service.line);
            setTimeout(function () { service.dequeue(); }, 600000);
            status.status = true;
            log_client(time_now);
            return status;
        }
    }
}