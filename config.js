var config = {
    database: {
        host: 'localhost', 		// host da Base de Dados
        user: 'root', 			// username da Base de Dados
        password: 'emanuel', 			// password da Base de Dados
        port: 3306, 			// MySQL porto por defeito
        database: 'infopower_pt' 	// nome da base de dados
    },
    server: {
        host: 'http://127.0.0.1/',
        hostOnline: 'https://guarded-temple-64733.herokuapp.com/',
        port: process.env.PORT || 8888
    },
    secret: 'supersecret'
}

module.exports = config