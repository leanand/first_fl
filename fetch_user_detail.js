function extractEmails ( text ){
	return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

var Curl = require( 'node-libcurl' ).Curl;
var userDetailURL  = "https://www.instagram.com/{{username}}/?__a=1";
module.exports = function(userName){
	if(!userName){
		return null;
	}
	console.log("Fetching user details for", userName);
	var requiredUrl = userDetailURL.replace(/{{username}}/, userName);

	var curl = new Curl();
	curl.setOpt( Curl.option.URL , requiredUrl );
	curl.setOpt( Curl.option.HTTPHEADER, [
		'origin: https://www.instagram.com',
		'x-requested-with: XMLHttpRequest',
		'accept-language: en-US,en;q=0.8',
		'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
		'accept: */*',
		'referer: https://www.instagram.com/gpaol/following/',
		'authority: www.instagram.com',
		'cookie: mid=V5y3eQAEAAFhLHd05uYpCJlfx1h9; fbm_124024574287414=base_domain=.instagram.com; sessionid=IGSCbc916e9620427eaa7eceb3bdcddab64b07c7344e134e8814d1f766e9fca6e83d%3AoCbZd8PstVhzmuGTw0Df2lvL39QRpEy4%3A%7B%22_token_ver%22%3A2%2C%22_auth_user_id%22%3A3603966836%2C%22_token%22%3A%223603966836%3ALaLJP5FWRplMko450Qv8xvWGycKwFVzq%3Ae00205d153f81ed1ddd3783bebd1acc78e99e387584fbffd2254115ccc52561a%22%2C%22asns%22%3A%7B%2267.246.134.1%22%3A11351%2C%22time%22%3A1469902651%7D%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22last_refreshed%22%3A1469902732.493356%2C%22_platform%22%3A4%2C%22_auth_user_hash%22%3A%22%22%7D; ig_pr=2; ig_vw=795; fbsr_124024574287414=Q8_bV8JRzOk40iNYrMX6EMP4gugmUea1u8Sdg-MJC5I.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUJKd2lCMmdKcHhyVTFZRlMtMHRuZFhNN0dHUkFLRXRtbDdlRzBaV2ZSMThqQ1ZFMjdsNmpXSG9MYmRQaGMzVHJHZnk0WURCMXdKRHE1UWdNeVZ3aXExR2stOXdwTUZ3Y1FhODktYllZbGcwUWlCd3FkWW1DUW4wNnRzQ3lfTUZXcHRWbHhTSWdrVjdvd2NQTTFIN29ydzJUQURERTBINGc5UHJiVWJMMWhaZHludEI4N21LX05jNXNmUE5MSGNoZHBVV1FLMDZqaUZHZXZuZDdoWHVPT05aQkhIMXE5Y1htQ2JjcUZkd3dkdXk1TWtINk8yZmV3Y0Y0elA2STJhNzloQ0ZLQ3FNNUQ4WHk5TWNJekptODlRb0dpaDhSZ3FyNVlDNHM4NWYxSVZUeTh6cmRqQzBSY2prZDFjMXMxZ25ydDNsZWhEVFYyNDZUdDJaUUU5U1JJMyIsImlzc3VlZF9hdCI6MTQ2OTkwMzg4MCwidXNlcl9pZCI6IjEwMDAwMDE3MDEwNTAzNiJ9; s_network=; csrftoken=vrOLxhKPiHuXAJBT3wQpK2vqbg4jA9fn; ds_user_id=3603966836'
	]);
	// curl.setOpt( Curl.option.VERBOSE, true );
	return new Promise(function(resolve, reject){
		curl.on( 'end', function( statusCode, body, headers ) {
			if(statusCode === 200){
				console.log("Retreived successfully :" , userName);
				var bodyParsed = JSON.parse(body);
				var biography = bodyParsed.user.biography;

				if(biography){
					var emails = extractEmails(biography);
					if(emails && emails.length > 0){
						var requiredEmail = emails[0];
					}else{
						requiredEmail = null;
					}
				}
				if(bodyParsed.user.follows){
					var followsCount = bodyParsed.user.follows.count;
				}else{
					var followsCount = 0;
				}
				this.close();
	    		var payload = {
	    			requiredEmail : requiredEmail,
	    			followsCount: followsCount,
	    			id: bodyParsed.user.id
	    		};
    			resolve(payload);
			}else{
				var payload = {
	    			requiredEmail : null,
	    			followsCount: 0,
	    			id: 0
	    		};
    			resolve(payload);
			}
		});
		curl.on( 'error', function(){
			this.close();
			reject();
		});
		curl.perform();
	});
};







