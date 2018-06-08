var app = require('./app');
var config = require('./config');

app.listen(config.server.port, function(){
	console.log('Server running at port 8888: http://127.0.0.1:8888')
});