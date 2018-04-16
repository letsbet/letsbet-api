# letsbet-api
Letsbet API server

One of the reasons to setup this server is to keep track of historical prices for our top 10 currencies from **coinmarketcap.com**.
Till now there is no historical prices for this feed and we want to have a precise values once closing games.


#### Run a server
```node
node server.js
```

#### Run a feed update every minute
```node
node jobs/fx-rates.js
```


