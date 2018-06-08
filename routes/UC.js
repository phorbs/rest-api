var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

//registar uc
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var uc = {
            unidadeCurricular: req.body.designacao
        }
        req.getConnection(function (error, conn) {
            conn.query('INSERT INTO ucs SET ?', uc, function (err, result) {
                if (err) return res.status(500).send("Erro ao registar");
                res.status(200).send('Unidade ' + uc.unidadeCurricular + ' registada');
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//obter lista uc
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            conn.query('select * from ucs order by iduc desc', function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//obter uma uc
router.get('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            conn.query('select * from ucs where iduc = ?', req.params.id, function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                if (rows.length <= 0) {
                    return res.status(404).send("UC não encontrada");
                } else {
                    res.status(200).send(rows);
                }
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//atualizar uma uc
router.put('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var uc = {
            iduc: req.params.id,
            unidadeCurricular: req.body.designacao
        }
        req.getConnection(function (error, conn) {
            conn.query('update ucs set ? where iduc = ?', [uc, uc.iduc], function (err, result) {
                if (err) return res.status(500).send("Erro ao registar");
                res.status(200).send('Unidade ' + uc.unidadeCurricular + ' atualizada');
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//eliminar uc
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var uc = {
            iduc: req.params.id
        }
        req.getConnection(function (error, conn) {
            conn.query('delete from ucs where iduc = ?', uc.iduc, function (err, result) {
                if (err) return res.status(500).send("Erro ao eliminar");
                res.status(200).send('Unidade eliminada');
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

module.exports = router;