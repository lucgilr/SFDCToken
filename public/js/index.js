jQuery(document).ready(function() {

  "use strict";

  console.log("document ready");

  $('#loginInfo').submit(function(event) {

  	console.log("username: "+$('#username').val());
  	console.log("password: "+$('#password').val());

  	var formData = 'grant_type=password'+
  	 				'&client_id=3MVG98_Psg5cppyZFSE9IdHLIUHC7NS3_V8Oec0wsphdsCcAg5GtxeAciNbKunR5FKkI4pzmWgw5v5qrULPfv'+
  	 				'&client_secret=2622055315156138549'+
  	 				'&username='+$('#username').val()+
  	 				'&password='+$('#password').val()

	$.ajax({
		type: 'POST',
		url: 'https://login.salesforce.com/services/oauth2/token',
		data: formData,
		crossDomain: true,
		headers: {
      		'Content-Type': 'application/x-www-form-urlencoded',
      		'Access-Control-Allow-Origin': 'https://sfdc-login-token.herokuapp.com/'
    	},
		success : function(result) {
			console.log("success!");
			console.log(result);
	    },
	    error : function(error) {
	    	console.log("error...");
			console.log(error);
	    }
	});        
	return false;
  });

});