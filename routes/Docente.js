var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: /docente/add
 * METHOD: post
 * req.body codigo e nome
 * 
 * registar docente
 */
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var docente = {
            codigo: req.body.codigo,
            nome: req.body.nome
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('INSERT INTO docentes SET ?', docente, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Docente ' + docente.nome + ' registado' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /docente/
 * METHOD: get
 * 
 * obter lista docentes
 */
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from docentes order by codigo desc', function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});


/**
 * ENDPOINT: /docente/edit/(:codigo)
 * METHOD: get
 * req.params codigo
 * 
 * obter docente em função do codigo
 */
router.get('/edit/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from docentes where codigo = ?', req.params.codigo, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Docente não encontrado" });
                } else {
                    res.status(200).send(rows);
                }
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /docente/edit/(:codigo)
 * METHOD: put
 * req.params codigo
 * req.body nome
 * 
 * atualizar o docente em função do código
 */
router.put('/edit/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var docente = {
            codigo: req.params.codigo,
            nome: req.body.nome
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('update docentes set ? where codigo = ' + docente.codigo, docente, function (err, result) {
                if (err) return res.status(500).send("Erro ao registar");
                res.status(200).send({ message: 'Docente ' + docente.nome + ' atualizada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /docente/delete/(:codigo)
 * METHOD: delete
 * req.params codigo
 * 
 * eliminar docente em função do código
 */
router.delete('/delete/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var docente = {
            codigo: req.params.codigo
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('delete from docentes where codigo = ?', docente.codigo, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao eliminar" });
                res.status(200).send({ message: 'Docente eliminado' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

module.exports = router;