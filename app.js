var Optimist = require('optimist');
var Colors = require('colors');
var logic = require('./business_logic');
var argv = Optimist.argv;
var dbInit = require('./database_init')();
var instaScrapper = require('./business_logic');
if(argv.s === undefined){
    console.log("Seed Id required".red);
    return;
}
var seed = argv.s;

dbInit.then(function(){
  var scrapper = new instaScrapper(seed, true);  
})

