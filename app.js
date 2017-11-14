
const CONFIG = require('./config.json');
const DEFAULT_PORT = 3000;

//modules
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
var server = require('http').createServer(app);

//middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var routes = require('./server/routes/index');
app.use(routes);

// start the server with the port
var port = process.env.PORT || CONFIG.port || DEFAULT_PORT;
server.listen(port, function(){
    console.log('listening on port ' + port);
});

