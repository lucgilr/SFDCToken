var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();

var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
	try {	
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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
		var code = req.query.code;
		if (code) {
			code = querystring.unescape(code);
		}
		console.log('CALLBACK - code: ' + code);
		var startURL = req.query.state;
		if (startURL) {
			startURL = querystring.unescape(startURL);
		}
		console.log('CALLBACK - startURL: ' + startURL);

		var tokenResponse = null;
		var communityURL = 'vldtest-developer-edition.eu6.force.com';

		var postData = {
			code: code,
			grant_type: 'authorization_code',
			client_id: '3MVG98_Psg5cppyZT.V54UWRRSi0tcHOtdsX0VQ3DfW.Rf479WhMV9nVCTIp39qeCQLIjZsWIL4HDWRFX6n_P',
			client_secret: '9219936345482605892',
			redirect_uri: 'https://sfdc-login-token.herokuapp.com/callback'
		};

		var postOptions = {
			host: communityURL,
			port: '443',
			path: '/embeddedlogin/services/oauth2/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(JSON.stringify(postData))
			}
		};

		console.log('CALLBACK - postData: ' + JSON.stringify(postData));
		console.log('CALLBACK - postOptions: ' + JSON.stringify(postOptions));

		 var postReq = http.request(postOptions, function(postRes) {
			postRes.setEncoding('utf8');

			var response = '';
			postRes.on('data', function (chunk) {
				response += chunk;
			});

			postRes.on('end', function () {
				console.log('CALLBACK - response: ' + response);

				var html = '<html><head>' +
						   '<meta name="salesforce-community" content="https://' + communityUrl + '/embeddedlogin">' +
						   '<meta name="salesforce-mode" content="modal-callback">' +
						   '<meta name="salesforce-server-callback" content="true">' +
						   '<meta name="salesforce-server-response" content="' + new Buffer(response).toString('base64') + '">' +
						   '<meta name="salesforce-server-starturl" content="' + startURL + '">' +
						   '<meta name="salesforce-target" content="#salesforce-login">'+
						   '<meta name="salesforce-allowed-domains" content="https://sfdc-login-token.herokuapp.com">' +
						   '<script src="https://' + communityUrl + '/embeddedlogin/servlet/servlet.loginwidgetcontroller?type=javascript_widget&min=false&cacheMaxAge=0" async defer></script>' +
						   '</head><body></body></html>';
				console.log('CALLBACK - html: ' + html);

				res.writeHeader(200, {"Content-Type": "text/html"});
				res.write();
				res.end();
			});
		});

		// post the data
		postReq.write(postData);
		postReq.end();

	} catch (exception) {
		console.log(exception);
	}
});

module.exports = router;
