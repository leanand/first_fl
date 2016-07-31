var Optimist = require('optimist');
var Colors = require('colors');
var argv = Optimist.argv;
var dbInit = require('./database_init')();
var instaScrapper = require('./business_logic');
var seed = argv.s;
var type;
if(argv.t){
  type = argv.t;
}

dbInit.then(function(){
  if(seed){
    sequelizeDB.query("INSERT INTO users (username, is_seed) VALUES (?, ?)", {replacements: [seed, true ]}).then(function(){
      var scrapper = new instaScrapper.instagramScrapper();  
    }).catch(function(){
    	var scrapper = new instaScrapper.instagramScrapper();
    });
  }else{
    var scrapper = new instaScrapper.instagramScrapper();  
  }
});

