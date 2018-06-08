var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

//registar inscricao(implica criar um codigo de barras)
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var inscricao = {
            alunos_codigo: req.body.codigo,
            provas_idprova: req.body.idprova,
            data: Date.now()
        }
        req.getConnection(function (error, conn) {
            var sql = 'select * from inscricoes where alunos_codigo = ? and provas_idprova = ?';
            conn.query(sql, [inscricao.alunos_codigo, inscricao.provas_idprova], function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                if (rows.length > 0) {
                    return res.status(404).send("Sistema não admite dupla inscrição à mesma prova");
                } else {
                    conn.query('INSERT INTO inscricoes SET ?', inscricao, function (err, result) {
                        if (err) return res.status(500).send("Erro ao registar");
                        res.status(200).send('Inscrição registada');
                    });
                }
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//obter lista inscricoes
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT inscricoes.idinscricao, inscricoes.alunos_codigo, inscricoes.data, provas.data, inscricoes.provas_idprova, inscricoes.presenca, ucs.unidadeCurricular\
        from inscricoes\
        inner join provas on provas_idprova = provas.idprova\
        inner join ucs on provas.ucs_iduc = ucs.iduc\
        order by provas.data asc';
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

//obter lista de inscrições
router.get('/edit/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        req.getConnection(function (error, conn) {
            var sql = 'SELECT inscricoes.idinscricao, inscricoes.alunos_codigo, inscricoes.data, provas.data, inscricoes.provas_idprova, inscricoes.presenca, ucs.unidadeCurricular\
        from inscricoes\
        inner join provas on provas_idprova = provas.idprova\
        inner join ucs on provas.ucs_iduc = ucs.iduc\
        where inscricoes.alunos_codigo = ? \
        order by provas.data asc';
            conn.query(sql, req.params.codigo, function (err, rows, fields) {
                if (err) return res.status(500).send("Erro ao obter");
                if (rows.length <= 0) {
                    return res.status(404).send("Inscrições não encontrada");
                } else {
                    res.status(200).send(rows);
                }
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

//eliminar uc
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var inscricao = {
            idinscricao: req.params.id
        }
        req.getConnection(function (error, conn) {
            conn.query('delete from inscricoes where idinscricao = ?', inscricao.idinscricao, function (err, result) {
                if (err) return res.status(500).send("Erro ao eliminar");
                res.status(200).send('Inscrição eliminada');
            });
        });

    } else {
        res.status(403).send('Não tem permissão para aceder a este serviço');
    }
});

module.exports = router;