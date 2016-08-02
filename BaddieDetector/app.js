var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('BaddieDetector');
var methodOverride = require('method-override');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());

require('./public/APIKeyLastUsed.js')(app); // make test.js server-sided; routing GET everytime test.js invoked

//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    //console.error(err.stack);
//    next(err);
//});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {

        if (res.status(err.status || 500)) {
            console.log(err.status);
            res.send('error', {
                message: err.message,
                error: err
            });
        }
    });
};

app.use(function (err, req, res, next) {

    if (res.status(err.status || 500)) {
        console.log(err.status);
        res.send({
            status: 500,
            message: 'internal error',
            type: 'internal'
        });
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});