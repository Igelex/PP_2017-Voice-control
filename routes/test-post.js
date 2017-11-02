var express = require('express');
var router = express.Router();

let testObject = {
    hello: 'hello',
    client: 'client'
};

/* GET home page. */
router.post('/test', function(req, res, next) {
    /*res.render('index', { title: 'Express' });*/
    res.send('Thank you for ' + req.body);
});

module.exports = router;
