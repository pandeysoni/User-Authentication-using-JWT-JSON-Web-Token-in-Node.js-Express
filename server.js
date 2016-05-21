var express = require('express'),
    Routes = require('./server/routes'),
    config = require('./server/config/config'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./server/config/db'),
    path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/')));

app.get('*', function(req, res) {
    res.sendFile(path.resolve('client/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});
/** load routes*/

require('./server/routes')(app);

var port = config.server.port;

app.listen(process.env.PORT || port);

console.log('App started on port ' + port);