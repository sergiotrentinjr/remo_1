const express = require('express');
const crypto = require('crypto');
const connection = require('./database/connection');
const { request } = require('http');
const { response } = require('express');
const UsuarioController = require('./controllers/UsuarioController');
const EstoriaUsuarioController = require('./controllers/EstoriaUsuarioController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');
const SprintController = require('./controllers/SprintController');
const ProjetoController = require('./controllers/ProjetoController');
const TarefaController  = require('./controllers/TarefaController');
const LogsController  = require('./controllers/LogsController');
const CriteriosController = require('./controllers/CriterioAceite');

const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.post('/usuario', UsuarioController.create);
routes.get('/usuario', UsuarioController.index);

routes.get('/profile', ProfileController.index);

routes.get('/projeto', ProjetoController.index);
routes.get('/projeto/:id', ProjetoController.get);
routes.post('/projeto', ProjetoController.create);
routes.put('/projeto/:id', ProjetoController.update);
routes.put('/projetousuario', ProjetoController.insertUsuarioProjeto);
routes.get('/projetousuario', ProjetoController.getProjetoUsuario);
routes.delete('/projetousuario/:id', ProjetoController.deleteUsuarioProjeto);

routes.delete('/tarefadelete/:id',TarefaController.delete);
routes.get('/tarefa', TarefaController.index);
routes.get('/doc', TarefaController.indexDoc);
routes.get('/tarefa/:id', TarefaController.get);
routes.post('/tarefa', TarefaController.create);
routes.put('/tarefa/:id', TarefaController.update);

routes.post('/estoria_usuario', EstoriaUsuarioController.create);
routes.get('/estoria_usuario', EstoriaUsuarioController.index);
routes.get('/estoria_usuario_doc', EstoriaUsuarioController.indexDoc);
routes.get('/estoria_usuario/:id', EstoriaUsuarioController.get);
routes.delete('/estoria_usuario/:id',EstoriaUsuarioController.delete);
routes.put('/estoria_usuario/:id',EstoriaUsuarioController.update);

routes.put('/criterioaceite/:id', CriteriosController.get);
routes.post('/criterioaceite', CriteriosController.create);
routes.delete('/criterioaceite/:id', CriteriosController.delete);
routes.get('/criterioaceitedoc', CriteriosController.index);

routes.get('/sprint', SprintController.index);
routes.get('/sprint/:id', SprintController.get);
routes.get('/processarSprints', SprintController.processarSprint);
routes.post('/sprint', SprintController.create);
routes.put('/sprint/:id', SprintController.update);
routes.delete('/arquivar/:id', SprintController.arquivar);

/* Não é o ideal mas acontece, são gets */
routes.put('/logseu', LogsController.getLogEU);
routes.put('/logstarefas', LogsController.getLogTarefa);
routes.put('/logsprint', LogsController.getLogSprint);
routes.put('/logprojetos', LogsController.getLogProjetos);

module.exports = routes;