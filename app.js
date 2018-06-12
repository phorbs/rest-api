var express = require('express');
var app = express();
var logger = require("morgan");

var mysql = require('mysql');
var myConnection = require('express-myconnection');
var config = require('./config');

app.use(myConnection(mysql, config.database, 'pool'));

app.use(logger("dev"));


/**
 * Este módulo permite utilizar verbos HTTP
 * tais como: PUT ou DELETE em "sitios" que não são suportados
 */ 
var methodOverride = require('method-override')

/**
 * Fazer "override" do método (i.e., do verbo HTTP).
 * Por exemplo:  
 * O Pedido é para ser feito com "DELETE", mas coloca-se um verbo "POST"
 * no "METHOD" do formulário (todos os "sitios" conhecem este verbo)
 * e no HTML esconde-se um campo com o valor do método a utilizar de facto
 * que poderá ser "DELETE".
 * Quando é recebido o formulário no servidor, testa-se pela presença de 
 * um '_method' (urlencoded) e caso este exista fazemos o "override"
 * para o verbo "DELETE".
 *
 * Existem outras formas que podem consultar em:
 * https://www.npmjs.com/package/method-override
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // procura o método no corpo do POST 'urlencoded' e apaga-o
    var method = req.body._method
    delete req.body._method
    return method // Retorna o método "mapeado"
  }
}))


//------- endpoints

//endpoint para registar utilizadores
var Auth = require('./routes/Auth');
app.use('/api/auth', Auth);

//endpoint para login
var User = require('./routes/User');
app.use('/user', User);

//endpoint para unidades curriculares
var UC = require('./routes/UC');
app.use('/uc', UC);

//endpoint para provas
var Prova = require('./routes/Prova');
app.use('/prova', Prova);

//endpoint para docentes
var Docente = require('./routes/Docente');
app.use('/docente', Docente);

//endpoint para inscricao
var Inscricao = require('./routes/Inscricao');
app.use('/inscricao', Inscricao);

module.exports = app;