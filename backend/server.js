var config = require('../config');

var http = require('http');

var app = require('./app');
var routes = require('./routes');



//app.set('port', process.env.PORT || config.ports.server);
app.set('port', config.ports.server);


try {
http.createServer(app).listen(app.get('port'), function(){
	console.log("Server listening on port " + app.get('port'));
});
} catch (err){
	console.log("Error trying to start the server: "+err);
}


app.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});
