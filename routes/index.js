var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();

var request = require('request');
var querystring = require('querystring');

app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
	try {	
		//res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('index2');
	} catch (exception) {
		console.log(exception);
	}
});

router.get('/_callback', function(req, res, next) {
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
		var communityUrl = 'https://vldtest-developer-edition.eu6.force.com';

		var postOptions = {
			url: communityUrl + '/embeddedlogin/services/oauth2/token',
			method: 'POST',
			form: {
				code: code,
				grant_type: 'authorization_code',
				client_id: '3MVG98_Psg5cppyZT.V54UWRRSi0tcHOtdsX0VQ3DfW.Rf479WhMV9nVCTIp39qeCQLIjZsWIL4HDWRFX6n_P',
				client_secret: '9219936345482605892',
				redirect_uri: 'https://sfdc-login-token.herokuapp.com/_callback'
			}
		};

		console.log('CALLBACK - POST - options: ' + JSON.stringify(postOptions));

		request(postOptions, function(error, httpResponse, postResponse) {
			console.log('CALLBACK - POST - error:', error);
			console.log('CALLBACK - POST - statusCode:', httpResponse && httpResponse.statusCode);
			console.log('CALLBACK - POST - headers:', httpResponse && httpResponse.headers);
			console.log('CALLBACK - POST - response:', postResponse);

			if (httpResponse && httpResponse.statusCode != 200) {
				res.status(httpResponse.statusCode).json(JSON.parse(postResponse));
				return;
			}

			var postResponseObj = JSON.parse(postResponse);
			var access_token = postResponseObj.access_token;
			var identity = postResponseObj.id;
			console.log('CALLBACK - POST - access_token:', access_token);
			console.log('CALLBACK - POST - identity:', identity);

			var getOptions = {
				url: identity + '?version=latest',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + access_token
				}
			};
			console.log('CALLBACK - GET - options: ' + JSON.stringify(getOptions));
			request(getOptions, function(error, httpResponse, getResponse) {
				console.log('CALLBACK - GET - error:', error);
				console.log('CALLBACK - GET - statusCode:', httpResponse && httpResponse.statusCode);
				console.log('CALLBACK - GET - headers:', httpResponse && httpResponse.headers);
				console.log('CALLBACK - GET - response:', getResponse);

				if (httpResponse && httpResponse.statusCode != 200) {
					res.status(httpResponse.statusCode).json(JSON.parse(getResponse));
					return;
				}

				var html = '<html><head>' +
						   '<meta name="salesforce-community" content="' + communityUrl + '/embeddedlogin">' +
						   '<meta name="salesforce-mode" content="modal-callback">' +
						   '<meta name="salesforce-server-callback" content="true">' +
						   '<meta name="salesforce-server-response" content="' + new Buffer(getResponse).toString('base64') + '">' +
						   '<meta name="salesforce-server-starturl" content="' + startURL + '">' +
						   '<meta name="salesforce-target" content="#salesforce-login">'+
						   '<meta name="salesforce-allowed-domains" content="https://sfdc-login-token.herokuapp.com">' +
						   '<script src="' + communityUrl + '/embeddedlogin/servlet/servlet.loginwidgetcontroller?type=javascript_widget&min=false&cacheMaxAge=0" async defer></script>' +
						   '</head><body></body></html>';
				console.log('CALLBACK - html: ' + html);

				res.writeHeader(200, {"Content-Type": "text/html"});
				res.write(html);
				res.end();
			});
		});

	} catch (exception) {
		console.log(exception);
	}
});

module.exports = router;
