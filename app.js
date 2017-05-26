var express = require('express');
var basicAuth = require('express-basic-auth');
var bodyParser = require('body-parser');
var config = require(process.env.NODE_CONFIG_FILE_API);

var logger = require('./src/config/log');

logger.info('Starting app...');
var app = express();

var authObject = {};
authObject[config.basicauth.user] = config.basicauth.password;

app.use(basicAuth({
    users: authObject
}));

// Don't add routes before this line! All routes pass through the require https filter.
app.use(requireHTTPS);
app.use(bodyParser.json());

var vdsApiRouter = require('./src/routes/vdsApiRoutes')(logger, config);
var nedApiRouter = require('./src/routes/nedApiRoutes')(logger, config);


app.use('/api/vds', vdsApiRouter);
app.use('/api/ned', nedApiRouter);


var server = require('./src/server/server');
server.create(logger, config, app, function (err) {
    if (err) {
        logger.error('Error: Could not start server!');
    }
});

// Helper functions
function requireHTTPS(req, res, next) {
    if (!req.secure && config.ssl.active) {
        return res.redirect('https://' + req.get('host').split(':')[0] + ':' + config.web.ssl_port + req.url);
    }
    next();
}


module.exports = app; // for testing