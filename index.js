// app.js
var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/node_modules'));

/*
var whitelist = ['http://www.comunicca.com.br', 'http://server.comunicca.com.br', 'http://server.comunicca.com.br:8001', 'http://www.yeapps.com.br', 'http://yeapps.com.br']
var corsOptionsDelegate = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
*/
/*
app.use(cors({
  origin: 'http://www.yeapps.com.br'
}));
*/
/*
var allowedOrigins = ['http://server.comunicca.com.br:8001',
                        'http://yeapps.com.br',
						'http://www.yeapps.com.br'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
*/

var whitelist = ['http://www.yeapps.com.br', 'http://yeapps.com.br'];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.get('/', cors(corsOptionsDelegate), function (req, res, next) {
	res.sendFile(__dirname + '/socket.html');
})

io.on('connection', function(client) {
	console.log('Cliente conectado');
	// console.log(' %s sockets connected', io.engine.clientsCount);
	
	client.on('messages', function(data) {
		data.cliente_id = client.id;
		// console.log("BROAD["+data.broad+"]");
		console.log(""+data.broad+" "+data.user+": "+data.msg+" ["+data.params+"] ID:["+data.cliente_id+"]");
		client.emit(""+data.broad+"", data);
		client.broadcast.emit(""+data.broad+"",data);
	});
});

server.listen(8001);
