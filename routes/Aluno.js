var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: /aluno/add
 * METHOD: post
 * req.body codigo e nome e curso
 * 
 * registar aluno
 */
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var aluno = {
            codigo: req.body.codigo,
            nome: req.body.nome,
            curso: req.body.curso
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('INSERT INTO alunos SET ?', aluno, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Aluno ' + aluno.nome + ' registado' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /aluno/
 * METHOD: get
 * 
 * obter lista alunos
 */
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from alunos order by codigo desc', function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});


/**
 * ENDPOINT: /aluno/edit/(:codigo)
 * METHOD: get
 * req.params codigo
 * 
 * obter aluno em função do codigo
 */
router.get('/edit/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "EH") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('select * from alunos where codigo = ?', req.params.codigo, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Aluno não encontrado" });
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
 * ENDPOINT: /aluno/edit/(:codigo)
 * METHOD: put
 * req.params codigo
 * req.body nome
 * 
 * atualizar o aluno em função do código
 */
router.put('/edit/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var aluno = {
            codigo: req.params.codigo,
            nome: req.body.nome,
            curso: req.body.curso
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('update alunos set ? where codigo = ' + aluno.codigo, aluno, function (err, result) {
                if (err) return res.status(500).send("Erro ao registar");
                res.status(200).send({ message: 'Aluno ' + aluno.nome + ' atualizada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /aluno/delete/(:codigo)
 * METHOD: delete
 * req.params codigo
 * 
 * eliminar aluno em função do código
 */
router.delete('/delete/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "EH") {
        var aluno = {
            codigo: req.params.codigo
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('delete from alunos where codigo = ?', aluno.codigo, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao eliminar" });
                res.status(200).send({ message: 'Aluno eliminado' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

module.exports = router;