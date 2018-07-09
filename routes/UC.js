var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: /uc/add/
 * METHOD: post
 * req.body designacao
 * 
 * criar uma unidade curricular
 */
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var uc = {
            unidadeCurricular: req.body.designacao
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('INSERT INTO ucs SET ?', uc, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Unidade ' + uc.unidadeCurricular + ' registada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /uc/
 * METHOD: get
 * 
 * obter lista de unidades curriculares
 */
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from ucs order by iduc desc', function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /uc/edit/(:id)
 * METHOD: get
 * req.params id
 * 
 * obter uma uc em função do id
 */
router.get('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from ucs where iduc = ?', req.params.id, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "UC não encontrada" });
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
 * ENDPOINT: /uc/edit/(:id)
 * METHOD: put
 * req.params id
 * req.body designacao
 * 
 * atualizar uma unidade curricular em função do id
 */
router.put('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var uc = {
            iduc: req.params.id,
            unidadeCurricular: req.body.designacao
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('update ucs set ? where iduc = ' + uc.iduc, uc, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Unidade ' + uc.unidadeCurricular + ' atualizada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /uc/delete/(:id)
 * METHOD: delete
 * req.params id
 * 
 * eliminar unidade curricular em função do id
 */
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var uc = {
            iduc: req.params.id
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('delete from ucs where iduc = ?', uc.iduc, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao eliminar" });
                res.status(200).send({ message: 'Unidade eliminada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

module.exports = router;