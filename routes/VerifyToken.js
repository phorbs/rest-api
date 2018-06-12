var jwt = require('jsonwebtoken');
var config = require('../config');

//express middleware para verificar o token caso seja valido devolver os dados do utilizador
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Não existe token associado' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Não foi possivel autenticar' });
        req.getConnection(function (error, conn) {
            conn.query('SELECT * FROM utilizadores WHERE idutilizador = ' + decoded.id, function (err, rows, fields) {
                if (err) {
                    return res.status(500).send({ message: "erro na bd" });
                }
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Utilizador não encontrado" })
                }
                //tem de ser dentro deste scope 
                req.user = rows[0];
                next();
            });
        });
    });
}

module.exports = verifyToken;