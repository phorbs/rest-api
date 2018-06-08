var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

//registar codigobarra
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var codigobarra = {
            provas_idprova: req.body.idprova
        }
        req.getConnection(function (error, conn) {
            conn.query('INSERT INTO codigobarras SET ?', codigobarra, function (err, result) {
                if (err) return res.status(500).send("Erro ao registar");
                res.status(200).send('Codigo barra ' + codigobarra.provas_idprova + ' registado');
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//obter codigo barras
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT idcodigobarra, provas_idprova FROM codigosbarras INNER JOIN provas ON codigosbarras.provas_idprova = provas.idprova ORDER BY provas.idprova desc';
        req.getConnection(function (error, conn) {
            conn.query(sql, function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//obter um codigo barras
router.get('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            conn.query('SELECT idcodigobarra, provas_idprova FROM codigosbarras INNER JOIN provas ON codigosbarras.provas_idprova = provas.idprova where idcodigobarra = ?', req.params.id, function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                if (rows.length <= 0) {
                    return res.status(404).send("Codigo barra não encontrado");
                } else {
                    res.status(200).send(rows);
                }
            });
        });
    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

module.exports = router;