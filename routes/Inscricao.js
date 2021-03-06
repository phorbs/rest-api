var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: /inscricao/add/
 * METHOD: post
 * req.body alunos_codigo e provas_idprova
 * 
 * criar uma inscrição
 * primeiro verifica se o aluno já está inscrito na prova,
 * caso seja verdade não permite uma nova inscrição.
 * 
 * Note que: a base de dados tem um trigger que não permite
 * que seja realizado uma inserção de uma inscrição
 * de uma prova que já expirou.
 */
router.post('/add', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var inscricao = {
            alunos_codigo: req.body.alunos_codigo,
            provas_idprova: req.body.provas_idprova,
            data: new Date().toLocaleDateString('ko-KR') // mysql apenas admite datas do formato Ymd que é adotado pelos paises asiaticos
        }
        req.getConnection(function (error, conn) {
            var sql = 'select * from inscricoes where alunos_codigo = ? and provas_idprova = ?';
            conn.query(sql, [inscricao.alunos_codigo, inscricao.provas_idprova], function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length > 0) {
                    return res.status(403).send({ message: "Sistema não admite dupla inscrição à mesma prova" });
                } else {
                    conn.query('INSERT INTO inscricoes SET ?', inscricao, function (err, result) {
                        if (err) return res.status(500).send({ message: err.message });
                        res.status(200).send({ message: 'Inscrição registada' });
                    });
                }
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: /inscricao/
 * METHOD: get
 * 
 * obter lista de inscricoes juntamente com as respetivas:
 * unidades curriculares e provas ordenado por data
 */
router.get('/', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT inscricoes.idinscricao, inscricoes.alunos_codigo, inscricoes.data, provas.data, inscricoes.provas_idprova, inscricoes.presenca, ucs.unidadeCurricular\
        from inscricoes\
        inner join provas on provas_idprova = provas.idprova\
        inner join ucs on provas.ucs_iduc = ucs.iduc\
        order by provas.data asc';
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
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
 * ENDPOINT: /inscricao/(:codigo)
 * METHOD: get
 * req.params codigo
 * 
 * obter lista de inscricoes juntamente com as respetivas:
 * unidades curriculares e provas com a permissa de que é
 * só as inscricoes relacionados com o código fornecido.
 */
router.get('/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var sql = 'SELECT inscricoes.idinscricao, inscricoes.alunos_codigo, inscricoes.data, provas.data, inscricoes.provas_idprova, inscricoes.presenca, ucs.unidadeCurricular\
        from inscricoes\
        inner join provas on provas_idprova = provas.idprova\
        inner join ucs on provas.ucs_iduc = ucs.iduc\
        where inscricoes.alunos_codigo = ?\
        order by provas.data asc';
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
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
 * ENDPOINT: /inscricao/edit/(:idinscricao)
 * METHOD: get
 * req.params idinscricao
 * 
 * obter uma inscricao juntamente com as respetivas:
 * unidades curriculares e provas com a permissa de que é
 * só as inscricoes relacionados com a inscrição fornecida.
 */
router.get('/edit/(:idinscricao)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            var sql = 'SELECT inscricoes.idinscricao, inscricoes.alunos_codigo, inscricoes.data, provas.data, inscricoes.provas_idprova, inscricoes.presenca, ucs.unidadeCurricular\
        from inscricoes\
        inner join provas on provas_idprova = provas.idprova\
        inner join ucs on provas.ucs_iduc = ucs.iduc\
        where inscricoes.idinscricao = ? \
        order by provas.data asc';
            conn.query(sql, req.params.idinscricao, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Inscrições não encontrada" });
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
 * ENDPOINT: /inscricao/delete/(:id)
 * METHOD: delete
 * req.params id
 * 
 * eliminar inscricao
 */
router.delete('/delete/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D" || req.user.permisao === "A") {
        var inscricao = {
            idinscricao: req.params.id
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('delete from inscricoes where idinscricao = ?', inscricao.idinscricao, function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao eliminar" });
                res.status(200).send({ message: 'Inscrição eliminada' });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});


/**
 * ENDPOINT: /inscricao/frequencias/(:codigo)
 * METHOD: get
 * req.params codigo
 * 
 * obter lista de frequencias
 */
router.get('/frequencias/(:codigo)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            var sql = 'SELECT a.nome, a.codigo FROM inscricoes i\
            , alunos a WHERE i.alunos_codigo = a.codigo AND\
             presenca = 1 AND i.provas_idprova = ?';

            conn.query(sql, req.params.codigo, function (err, rows, fields) {
                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Inscrições não encontrada" });
                } else {
                    res.status(200).send(rows);
                }
            });
        });
    } else if (req.user.permisao === "A") {
        //Buscar todas as disciplinas que o aluno tem a inscrição validada 
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            var sql = 'SELECT * FROM infopower_pt.inscricoes i, infopower_pt.ucs u,\
             infopower_pt.provas p WHERE i.provas_idprova = p.idprova AND \
             u.iduc = p.ucs_iduc AND i.presenca = 1 AND i.alunos_codigo=?';

            conn.query(sql, req.params.codigo, function (err, rows, fields) {

                if (err) return res.status(500).send({ message: "Erro ao obter" });
                if (rows.length <= 0) {
                    return res.status(404).send({ message: "Inscrições não encontrada" });
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
 * ENDPOINT: /inscricao/edit/(:id)
 * METHOD: put
 * req.params id
 * 
 * atualizar a presença na inscrição
 */
router.put('/edit/(:id)', VerifyToken, function (req, res) {
    if (req.user.permisao === "D") {
        var inscricao = {
            presenca: 1,
        }
        req.getConnection(function (error, conn) {
            if (error) {
                return res.status(500).send({ message: "erro na bd" });
            }
            conn.query('update inscricoes set ? where idinscricao = ?', [inscricao, req.params.id], function (err, result) {
                if (err) return res.status(500).send({ message: "Erro ao validar presença" });
                let sql = 'SELECT idinscricao, alunos_codigo, alunos.nome FROM inscricoes INNER JOIN alunos ON alunos.codigo = inscricoes.alunos_codigo where idinscricao =' + req.params.id
                conn.query(sql, function (err, result) {
                    if (err) return res.status(500).send({ message: "Erro ao validar presença" });
                    res.status(200).send({ message: 'Presença validada!', aluno: result });
                });
            });
        });

    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

module.exports = router;