const { create } = require("./UsuarioController");

const connection = require('../database/connection');
const { json } = require("express");
const { default: knex } = require("knex");


module.exports = {

    async get(request, response){
        const {id} = request.params;
        const estoria_usuario = await connection('estoria_usuario').select('*').where('idestoria',id);
        return response.json(estoria_usuario);
    },

    async index(request, response){
        
        const id = request.headers.authorization;
        const { page = 1} = request.query;

        const estoria_usuario = await connection('estoria_usuario').where('idprojeto',id).orderBy('status','asc').select('*');;

        return response.json(estoria_usuario);
    },

    async indexDoc(request, response){
        
        const id = request.headers.authorization;

        const estoria_usuario = await connection('estoria_usuario').where('idprojeto',id).orderBy('idestoria','asc').select('*');;

        return response.json(estoria_usuario);
    },


    async create (request, response){
        const { nome, status, persona, desejo, descricao,  idprojeto} = request.body;
        const id_usuario = request.headers.authorization;

        //IdEstoria, Nome, Status, Prioridade, Descricao, IdProjeto
        const IdEstoria = await connection('estoria_usuario').insert({
            nome, 
            status, 
            persona, 
            desejo,
            descricao,
            idprojeto,
        }).returning('idestoria').catch(err => {
            return err;
        });

        if( IdEstoria <= 0 || IdEstoria == null){
            IdEstoria = -406
            console.log("error");
        }

        return response.json({ IdEstoria })
    },

    async delete (request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const estoria_usuario = await connection('estoria_usuario').where('id', id).select('id_usuario').first();

        if (estoria_usuario.id_usuario != id_usuario) {
            return response.status(401).json({ error: 'Operação não permitida.'});
        }

        await connection('estoria_usuario').where('id', id).delete();

        return response.status(204).send();
    },

    async update (request, response){
        const {id} = request.params;
        const { nome, status, persona, desejo, descricao, idprojeto} = request.body;
        const idusuario = request.headers.authorization;
        let RegLog = '';
        let statusantigo = '';

        /* log manual */
        const [Euantiga] = await connection('estoria_usuario')
        .join('projeto_usuario', 'projeto_usuario.idprojeto', '=', 'estoria_usuario.idprojeto')
        .join('usuario', 'usuario.idusuario', '=', 'projeto_usuario.idusuario')
        .select('estoria_usuario.*', 'usuario.nome as usuarionome', 'usuario.email as email')
        .where({'estoria_usuario.idestoria': id, 'usuario.idusuario' : idusuario}).catch(err => {
            return err;
        });
    
        if(Euantiga.status == 'I'){
            statusantigo = ' Iniciar'
        }else if(Euantiga.status == 'D'){
            statusantigo = ' Desenvolvendo'
        }else {
            statusantigo = ' Finalizado' 
        }

        if(status == 'I'){
            statusnovo = ' Iniciar'
        }else if(status.status == 'D'){
            statusnovo = ' Desenvolvendo' 
        }else {
            statusnovo = ' Finalizado'
        }

        RegLog = "Alteração Feita por: " +  Euantiga.usuarionome + ", e-mail: "+ Euantiga.email 
        +"  - Dado Antigo { Funcionalidade: " + Euantiga.nome + ", Status: " + statusantigo +  ', "Como um: '+ Euantiga.persona+', eu desejo: '+Euantiga.desejo + ', para: ' + Euantiga.descricao + '}. Dado Novo {'+
                ' Funcionalidade: '+ nome + ', Status: ' + statusnovo + ', "Como um: '+ persona+', eu desejo: '+desejo + ', para: ' + descricao + '}'
        /* Fim do log manual */

        const [IdEstoria] = await connection('estoria_usuario').update({
            nome, 
            status,  
            persona, 
            desejo,
            descricao,
            idprojeto,
        }).where('idestoria',id).returning('idestoria').catch(err => {
            return err;
        });

        await connection('log_tabelas').insert({
            alteracao: RegLog, 
            tabela: 'Estoria_Usuario',
            idprojeto,
        }).catch(err => {
            return err;
        });

        if (IdEstoria <= 0 || IdEstoria == null) {
            return response.status(401).json({ error: 'Houve Problemas na Alteração da Estoria Usuario!'});
        }

        return response.json({ Id_Estoria: IdEstoria });
    },

}; 