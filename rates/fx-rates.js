var tiny = require('tiny-json-http');
var mysql = require('mysql');
var moment = require('moment');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'letsbet'
});

var url = "https://api.coinmarketcap.com/v1/ticker/?limit=10";

function FxRatesFeed(){

}

FxRatesFeed.prototype.handleFxRates = function(save,response){
    var self = this;
    var rates = [];
    if(response && response.length > 0){
        var now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        var rows=[];
        response.forEach(function(rate){
            var symbol = rate.symbol;
            var value =  parseFloat(rate.price_usd).toFixed(2);
            var timestamp = moment.unix(rate.last_updated).utc().format('YYYY-MM-DD HH:mm:ss');
            var row = [symbol,value,timestamp,now];
            var rate = {"symbol":symbol,"value":value,"timestamp":timestamp}
            rates.push(rate);
            rows.push(row);
            console.log("Feed: " + row);
        });
        if(save){
            self.storeFeed(rows);
        }
     }
     return rates;
}

FxRatesFeed.prototype.storeFeed = function(values){
    var sql = "INSERT INTO FX_RATES (symbol,value,timestamp,create_time) VALUES ?";
    pool.query(sql, [values], function(err) {
        if (err) throw err;
    });
}

FxRatesFeed.prototype.get = function(symbol,time,callback){
    var params=[symbol,time];
    var sql = "SELECT * FROM  FX_RATES WHERE symbol=? ORDER BY ABS( DATEDIFF(TIMESTAMP, ? ) ) LIMIT 1"
    
    if(!time){
        var params=[symbol];
        sql = "SELECT * FROM  FX_RATES WHERE symbol=? ORDER BY TIMESTAMP desc LIMIT 1"
    }
	pool.query(sql,params, function (err, result) {
        if (err) throw err;
		var rate = {};
		if(result.length > 0){
			rate = result[0];
		}
        callback(rate);
    });
}

FxRatesFeed.prototype.fetch = function(save,callback){
    var self = this;        
    tiny.get({url}, function __got(error, result) {
        if (error) {
            console.log("Error during fetching the feed from: " + url +  " Cause: " + error);
        }
        else {
           var response = result.body;
           var rates = self.handleFxRates(save,response);
           callback(rates);
        }
    });
}

module.exports = {
    FxRatesFeed : FxRatesFeed
};