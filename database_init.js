var fs = require('fs');
var Sequelize = require('sequelize');

var dbConfig = fs.readFileSync("database.json", {encoding: "UTF-8"});
dbConfig = JSON.parse(dbConfig);

GLOBAL.sequelizeDB = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password);

module.exports = function(){
  console.log("Checking database Connection")
  return sequelizeDB.authenticate().then(function(err) {
    console.log('Connection has been established successfully.'.blue);
  })
  .catch(function (err) {
      console.log('Unable to connect to the database:', err);
  });
};
