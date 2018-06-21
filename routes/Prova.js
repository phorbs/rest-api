var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

//registar prova
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var prova = {
            tipo: req.body.tipo,
            data: req.body.data,
            sala: req.body.sala,
            lotacaoMaxima: req.body.lotacao,
            docentes_codigo: req.body.codigo,
            estado: 0,
            ucs_iduc: req.body.iduc
        }
        req.getConnection(function (error, conn) {
            conn.query('INSERT INTO provas SET ?', prova, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Prova a ' + prova.data + ' registada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

//obter lista provas
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT provas.idprova, provas.tipo, provas.data, provas.sala, provas.lotacaoMaxima, provas.estado, docentes.nome, ucs.unidadeCurricular FROM provas INNER JOIN docentes ON provas.docentes_codigo=docentes.codigo INNER JOIN ucs ON provas.ucs_iduc = ucs.iduc ORDER BY provas.idprova desc';
        req.getConnection(function (error, conn) {
            conn.query(sql, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

//obter uma prova
router.get('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            conn.query('select * from provas where idprova = ?', req.params.id, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Prova não encontrada" });
                } else {
                    res.status(200).send(rows);
                }
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

//atualizar uma uc
router.put('/edit/(:id)', function (req, res) {    
    if (req.user.permisao === "D") {        
        var prova = {
            idprova: req.params.id,
            tipo: req.body.tipo,
            data: req.body.data,
            sala: req.body.sala,
            lotacaoMaxima: req.body.lotacao,
            docentes_codigo: req.body.codigo,
            estado: req.body.estado
        }
        
        req.getConnection(function (error, conn) {
            if(error) console.log(error);
            conn.query('update provas set ? where idprova = ' + prova.idprova, prova, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Prova de ' + prova.data + ' atualizada' });
            });
        });

     } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    } 
});

//eliminar uc
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var prova = {
            idprova: req.params.id
        }
        req.getConnection(function (error, conn) {
            conn.query('delete from provas where idprova = ?', prova.idprova, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao eliminar" });
                res.status(200).send({ message: 'Unidade eliminada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

module.exports = router;