var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');

/**
 * ENDPOINT: api/auth/register
 * METHOD: post
 * req.body: codigo e email
 * 
 * routeamento para registar o utilizador (passwords >= 6 caracteres)
 * numa tabela abstracta (não tem fk, mas associações de lógica) chamada utilizadores
 */
router.post('/register', function (req, res, next) {
    //bcrypt para cifrar password
    var hashedPassword = bcrypt.hashSync(req.body.password, 6);

    var user = {
        codigo: req.body.codigo,
        email: req.body.email,
        password: hashedPassword,
        permisao: 'A', //por omissão é aluno só pode ser alterado por backend
    };

    req.getConnection(function (error, conn) {
        if (error) {
            return res.status(500).send({ message: "erro na bd" });
        }
        conn.query('select idutilizador from utilizadores where codigo = ?', user.codigo, function (err, rows) {
            if (err) return res.status(500).send({ message: "Erro ao registar" });
            if (rows.length > 0) {
                return res.status(409).send({ message: "Conflito de utilizador" }); //numero escolar ja existe
            } else { //caso nao existir avançar com a inserção
                conn.query('INSERT INTO utilizadores SET ?', user, function (err, result) {
                    if (err) return res.status(500).send({ message: "Erro ao registar" });
                    //token sign é o metodo que vai criar uma identificação unica ao user
                    var token = jwt.sign(
                        { id: result.insertId }, //id do objeto associado
                        config.secret,
                        {
                            expiresIn: 86400 //24horas
                        });
                    res.status(200).send({ auth: true, token: token });
                });
            }
        });


    });

});

/**
 * ENDPOINT: api/auth/me
 * METHOD: get
 * 
 * Não é utilizado no sistema é apenas para fim de testes
 * exemplo de permissão de acesso a endpoint 
 */
router.get('/me', VerifyToken, function (req, res) {
    console.log(req.user.permisao);
    if (req.user.permisao === "A") {
        res.status(200).send(req.user);
    } else {
        res.status(403).send({ message: 'Não tem permissão para aceder a este serviço' });
    }
});

/**
 * ENDPOINT: api/auth/logout
 * Não é utilizado no sistema é apenas para fim de testes
 */
router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;