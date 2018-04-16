var rates = require('./../rates/fx-rates.js');
var cron = require('cron');
var tiny = require('tiny-json-http');
var mysql = require('mysql');
var moment = require('moment');

var everyMinute = "* * * * *";


function updateFxRates(){
   var feed = new rates.FxRatesFeed();
   feed.fetch(true,function(rates){
       
   });
}

new cron.CronJob({
    cronTime: everyMinute,
    onTick: function() {
        updateFxRates();
    },
    start: true,
    timeZone: 'UTC'
});

updateFxRates();