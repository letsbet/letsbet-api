var restify = require('restify');

var fxRates = require("./rates/fx-rates.js");
var fxFeed = new fxRates.FxRatesFeed();

var server = restify.createServer({
  formatters: {
      'application/json': function(req, res, body) {
          return JSON.stringify(body, null, 4 );
      }
  }
});

server.use(restify.plugins.queryParser());
server.name = "Letsbet API server";

server.get('/fx-rates', function (req, res, next){
  fxFeed.fetch(false,function(rates){
    res.json(rates);
  });
});

server.get('/fx-rates/:symbol', function (req, res, next){
  var symbol = req.params.symbol;
  var type = req.query.type;
  fxFeed.get(symbol,null,function(rate){
    if(type === "short" && rate.value){
      var value = new Number(rate.value);
      res.send(value);
    }else{
      res.json(rate);
    }
  });
});

server.get('/fx-rates/:symbol/:time', function (req, res, next){
  var symbol = req.params.symbol;
  var time = req.params.time;
  var type = req.query.type;
  
  fxFeed.get(symbol,time,function(rate){  
    if(type === "short" && rate.value){
      var value = new Number(rate.value);
      res.send(value);
    }else{
      res.json(rate);
    }
  });
});

server.on('NotFound', function(req, res, err) {
  res.send('Not Found');
});

server.listen(9090,'127.0.0.1', function() {
  console.log('%s listening at %s', server.name, server.url);
});