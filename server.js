var app = require('./app');
var config = require('./config');

app.listen(config.server.port, function(){
	console.log(`REST API na porta: ${config.server.port} no url: ${config.server.host}`)
});