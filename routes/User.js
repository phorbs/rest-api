var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

//fazer login com recurso a numero escolar e password e atribuir um token para o cliente guardar o token
//em session or local
router.post('/login', function (req, res) {
    var user = {
        codigo: req.body.codigo,
        password: req.body.password
    };
    var detailUser = {
        codigo: user.codigo,
        nome: '',
        permisao: '',
        tipo: ''
    }
    //atenção tenho de usar url encoded data para poder aceder aos parametros no request body
    if (user.codigo == undefined) return res.status(404).send("Numero indefinido");
    req.getConnection(function (error, conn) {
        //atenção de que a ligação em modo pool tenho de ter a preocupação de
        //responder com send para a ligação pool seja fechada
        //logo a partir do momento que esta esteja fechada,
        //tenho de quebrar o callback para que nao aceda a dados que já não estão
        //disponiveis.        
        conn.query('select * from utilizadores where codigo=?', user.codigo, function (err, rows, fields) {
            if (err) {
                //return res.status(500).send("Erro na bd: " + user.name + err.sqlMessage);
                return res.status(500).send({ message: "Erro na bd" });
            }
            if (rows.length <= 0) {
                return res.status(404).send({ message: "Utilizador não encontrado" })
            }
            var passwordIsValid = bcrypt.compareSync(user.password, rows[0].password);

            if (!passwordIsValid) {
                return res.status(401).send({ message: 'Password incorrecta' });
            }
            var token = jwt.sign({ id: rows[0].idutilizador }, config.secret, {
                expiresIn: 86400 // 24 horas
            });

            detailUser.permisao = rows[0].permisao;
            //para obter o aluno ou docente
            //utilizadores é uma entidade abstracta apenas para a autenticação
            conn.query('select * from docentes where codigo= ?', user.codigo, function (err, teacherRow) {
                if (err) {
                    return res.status(500).send({ message: "Erro na bd" });
                }
                if (teacherRow.length > 0) {
                    detailUser.nome = teacherRow[0].nome;
                    detailUser.tipo = 'docente'
                } else {
                    conn.query('select * from alunos where codigo= ?', user.codigo, function (err, studentRow) {
                        if (err) {
                            return res.status(500).send({ message: "Erro na bd" });
                        }
                        if (studentRow.length > 0) {
                            detailUser.nome = studentRow[0].nome;
                            detailUser.tipo = 'aluno'
                        }
                        res.status(200).send({ auth: true, token: token, user: detailUser });
                    });
                }
            });
        });
    });
});

module.exports = router;