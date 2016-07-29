var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    response.sendfile('index.html');
});

module.exports = router;