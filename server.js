'use strict'; 

const express = require('express')
const config = require('./server/config/config')
const bodyParser = require('body-parser')
const app = express()
const db = require('./server/config/db')
const path = require('path')
const logger = require('morgan')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/')));
app.use(logger('dev'));

app.get('*', function(req, res) {
    res.sendFile(path.resolve('client/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});
/** load routes*/

require('./server/user/user.server.routes')(app);

var port = config.server.port;

app.listen(process.env.PORT || port);

console.log('App started on port ' + port);
