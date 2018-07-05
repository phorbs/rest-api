var config = {
    database: {
        host: 'infopower.pt.mysql', 		// host da Base de Dados
        user: 'infopower_pt', 			// username da Base de Dados
        password: 'EmanuelComedorDeGatas', 			// password da Base de Dados
        port: 3306, 			// MySQL porto por defeito
        database: 'infopower_pt' 	// nome da base de dados
    },
/*     database: {
        host: 'localhost', 		// host da Base de Dados
        user: 'root', 			// username da Base de Dados
        password: 'emanuel', 			// password da Base de Dados
        port: 3306, 			// MySQL porto por defeito
        database: 'infopower_pt' 	// nome da base de dados
    }, */
    server: {
        host: 'https://guarded-temple-64733.herokuapp.com/',
        port: process.env.PORT || 8080
    },
    secret: 'supersecret'
}

module.exports = config