var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
	try {		
		res.render('index2');
	} catch (exception) {
		console.log(exception);
	}
});

router.post('/', function(req, res, next) {
	try {		
	    console.log('req received');
	    console.log('Username: '+req.body.username);
	    console.log('Password: '+req.body.password);
	} catch (exception) {
		console.log(exception);
	}
});

router.get('/callback', function(req, res, next) {
	try {		
		res.render('callback');
	} catch (exception) {
		console.log(exception);
	}
});

module.exports = router;
