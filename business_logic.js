var fetchUserDetails = require("./fetch_user_detail");
var fetchUserFollows = require("./fetch_user_follows");

function saveUserMail(userName, data){
	var requiredEmail = null, is_email_fetched = true;
	if(data.requiredEmail){
		requiredEmail = data.requiredEmail;
	}
	return sequelizeDB.query("UPDATE users SET email = ?, is_email_fetched = ? where username = ?", {replacements: [requiredEmail, is_email_fetched, userName]});
}; 


function saveUserFollowList(userName, requiredArray){
	if(requiredArray && requiredArray.length > 0){
		requiredArray = generateUserListQuery(requiredArray);
		return sequelizeDB.query("INSERT into users(username) VALUES " + requiredArray).then(function(){
			return sequelizeDB.query("UPDATE users SET is_list_fetched = true where username = ?", {replacements : [userName]});
		});
	}
};

function generateUserListQuery(userFollowList){
	if(userFollowList && userFollowList.length > 0){
		var requiredArray = userFollowList.map(function(user){
			return ["('", user.username,"')"].join("");
		});
		return requiredArray.join();
	}
};

function findNextUserToFetchMail(){
	return sequelizeDB.query("Select username from users where is_email_fetched=false LIMIT 1", { type: sequelizeDB.QueryTypes.SELECT}).then(function(user){
		if(user.length > 0){
			var username = user[0].username;
			return username;
		}else{
			console.log("No user detail to be fetched");
		}
	});
};

function findNextUserToFetchList(){
	return sequelizeDB.query("Select username from users where is_list_fetched=false LIMIT 1", { type: sequelizeDB.QueryTypes.SELECT}).then(function(user){
		if(user.length > 0){
			var username = user[0].username;
			return username;
		}else{
			console.log("No list to be fetched");
		}
	});
};

function fetchNextUserList(){
	var userName;
	return findNextUserToFetchList().then(function(username){
		userName = username;
		return fetchUserDetails(username);
	}).then(function(data){
		return fetchUserFollows(data.id, data.followsCount);
	}).then(function(data){
		return saveUserFollowList(userName, data);
	});
};

function instagramScrapper(){
	return findNextUserToFetchMail().then(function(username){
		if(username){
			return fetchUserDetails(username).then(function(data){
				return saveUserMail(username, data);
			}).then(function(){
				return instagramScrapper();
			})
		}else{
			return fetchNextUserList().then(function(){
				return instagramScrapper();
			});
		}
	});
};

module.exports = {
	instagramScrapper: instagramScrapper
};