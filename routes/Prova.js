var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: /prova/add
 * METHOD: post
 * req.body tipo, data, sala, lotacao, codigo, iduc
 * 
 * inserir prova
 */
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
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('INSERT INTO provas SET ?', prova, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Prova a ' + prova.data + ' registada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /prova/
 * METHOD: get
 * 
 * obter lista provas juntamente com os docentes,
 * unidades curriculares, soma das inscricoes e presenças
 */
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT provas.idprova, provas.tipo, provas.data, provas.sala, provas.lotacaoMaxima, provas.estado, docentes.nome, ucs.unidadeCurricular,\
        (select count(inscricoes.presenca) from inscricoes where inscricoes.provas_idprova = provas.idprova) as inscricoes,\
        (select sum(inscricoes.presenca) from inscricoes where inscricoes.provas_idprova = provas.idprova) as presencas\
        FROM provas \
        inner JOIN docentes ON provas.docentes_codigo=docentes.codigo \
        inner JOIN ucs ON provas.ucs_iduc = ucs.iduc'
        req.getConnection(function (error, conn) {
            if (error) return res.status(500).send({ message: "Erro no servidor" });
            conn.query(sql, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /prova/ativa
 * METHOD: get
 * 
 * obter a lista das provas ativas
 */
router.get('/ativa', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT provas.idprova, provas.tipo, provas.data, provas.sala, provas.lotacaoMaxima, provas.estado, docentes.nome, ucs.unidadeCurricular,\
        (select count(inscricoes.presenca) from inscricoes where inscricoes.provas_idprova = provas.idprova) as inscricoes,\
        (select sum(inscricoes.presenca) from inscricoes where inscricoes.provas_idprova = provas.idprova) as presencas\
        FROM provas \
        inner JOIN docentes ON provas.docentes_codigo=docentes.codigo \
        inner JOIN ucs ON provas.ucs_iduc = ucs.iduc \
        where provas.estado=1'
        req.getConnection(function (error, conn) {
            if (error) return res.status(500).send({ message: "Erro no servidor" });
            conn.query(sql, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /prova/(:codigo)
 * METHOD: get
 * req.params codigo
 * 
 * obter a lista das provas não inscritas apenas do código fornecido
 */
router.get('/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "A") {
        var sql = 'select * from provas \
        inner join ucs on ucs.iduc = provas.ucs_iduc \
        where idprova not in (select provas_idprova from inscricoes where alunos_codigo=?)';
        req.getConnection(function (error, conn) {
            if (error) return res.status(500).send({ message: "Erro no servidor" });
            conn.query(sql, req.params.codigo, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                res.status(200).send(rows);
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /prova/edit/(:id)
 * METHOD: get
 * req.params id
 * 
 * obter uma prova
 */
router.get('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
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

/**
 * ENDPOINT: /prova/edit/(:id)
 * METHOD: put
 * req.params id
 * req.body tipo, data, sala, lotacao, codigo, estado
 * 
 * atualizar a prova
 */
router.put('/edit/(:id)', VerifyToken, function (req, res) {
    if (!req.user) return res.status(401).send({ message: "Não autorizado" });
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
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('update provas set ? where idprova = ' + prova.idprova, prova, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao registar" });
                res.status(200).send({ message: 'Prova de ' + prova.data + ' atualizada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /prova/delete/(:id)
 * METHOD: delete
 * req.params id
 * 
 * eliminar prova
 */
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var prova = {
            idprova: req.params.id
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
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