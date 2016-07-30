var fetchUserDetails = require("./fetch_user_detail");
var fetchUserFollows = require("./fetch_user_follows");

function insertUserEmail(userName, isSeed, data){
	var requiredEmail  = null, completed = false, isSeeded = false;
	if(data.requiredEmail){
		requiredEmail = data.requiredEmail;
		completed = true;
	}
	if(isSeed){
		isSeeded = true;
		return sequelizeDB.query("INSERT into users(username, type, completed, email, user_id) VALUES(?, ?, ?, ?, ?)", {replacements:[userName, isSeeded, completed, requiredEmail, data.id]});
	}else{
		isSeeded = false;
		return sequelizeDB.query("UPDATE users SET completed = ?, email = ? where username = ?", {replacements:[completed, requiredEmail, userName]});
	}
}; 

function insertUserFollows(requiredArray){
	return sequelizeDB.query("INSERT into users(username, type, user_id) VALUES ?", {replacements : [requiredArray]});
};

function generateUserListQuery(userFollowList){
	if(userFollowList && userFollowList.length > 0){
		var requiredArray = userFollowList.map(function(user){
			return ["('", user.username, "',", false, ",'", user.id, "')"].join("");
		});
		return requiredArray.join();
	}
};

function instagramScrapper(userName, isSeed){
	var usableData;
	fetchUserDetails(userName).then(function(data){
		console.log("Details Fetched", data);
		usableData = data;
		return new insertUserEmail(userName, isSeed, data);
	}).then(function(){
		var followsCount = usableData.followsCount;
		var userId = usableData.id;
		if(followsCount){
			if(followsCount > 1500){
				throw Error(" User follows more than 1500 people");
			}else{
				console.log("Fetching user follows list ", userName);
				return new fetchUserFollows(userId, followsCount);
			}
		}
	}).then(function(data){
		var requiredArray = generateUserListQuery(data);
		return insertUserFollows(requiredArray);
	});
};

module.exports = instagramScrapper;