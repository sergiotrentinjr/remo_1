const { create } = require("./UsuarioController");

const connection = require('../database/connection');


module.exports = {

    async get(request, response){
        const {id} = request.params;
        const sprint = await connection('sprint').select('*').where('idsprint',id);
        return response.json(sprint);
    },

    async index(request, response){
        const id = request.headers.authorization;

        const sprint = await connection('sprint').where('idprojeto',id).select('*');

        return response.json(sprint);
    },

    async create (request, response){
        const { titulo, dataini, datafim, estimativa } = request.body;
        const idprojeto = request.headers.authorization;

        const id = await connection('sprint').insert({
            titulo, 
            dataini,
            datafim,
            idprojeto,
            estimativa
        }).returning('idsprint').catch(err => {
            return err;
        });
    
        return response.json({ id })
    },

    async update (request, response){
        const {id} = request.params;
        const { titulo, dataini, datafim, estimativa, idusuario } = request.body;
        const idprojeto = request.headers.authorization;
        let Logs = '';

        const [SprintAntiga] = await connection('sprint')
        .select('sprint.*')
        .where('sprint.idsprint', id).catch(err => {
            return err;
        });

        const [Usuario] = await connection('usuario')
        .select('usuario.*')
        .where('usuario.idusuario', idusuario).catch(err => {
            return err;
        });

        Logs = "Alteração Feita por: " +  Usuario.nome + ", e-mail: "+ Usuario.email +
        "  - Dado Antigo { Título: " + SprintAntiga.titulo + ", Estimativa: " + SprintAntiga.estimativa +  ', Data Início: ' + SprintAntiga.dataini + ', Data Fim: ' + SprintAntiga.datafim + 
        '}. Dado Novo {'+' Título: '+ titulo + ', Estimativa: ' + estimativa + ', Data Início: ' + dataini + ', Data Fim: ' + datafim + '}'

        const [idsprint] = await connection('sprint').update({
            titulo, 
            dataini,
            datafim,
            idprojeto,
            estimativa
        }).where('idsprint',id).returning('idsprint').catch(err => {
            return err;
        });

        if (idsprint <= 0 || idsprint == null) {
            return response.status(401).json({ error: 'Houve Problemas na Alteração da Sprint!'});
        }

        await connection('log_tabelas').insert({
            alteracao: Logs, 
            tabela: 'Sprint',
            idprojeto
        }).catch(err => {
            return err;
        });


        return response.json({ idsprint: idsprint });
    },



    async processarSprint(request, response){
        const idprojeto = request.headers.authorization;

        const sprint = await connection('sprint').where('idprojeto',idprojeto).orderBy('dataini','asc').select('idsprint','estimativa').catch(err => {
            return err;
        });


        const tarefas =  await connection('tarefa')
        .join('estoria_usuario', 'estoria_usuario.idestoria', '=', 'tarefa.idestoria')
        .select('tarefa.idtarefa','tarefa.estimativa','tarefa.prioridade', 'tarefa.frequenciauso', 'tarefa.frequenciauso as ordem', 'tarefa.frequenciauso as usado' )
        .orderBy('tarefa.frequenciauso','desc')
        .where('tarefa.idsprint', null)
        .where('estoria_usuario.idprojeto',idprojeto).catch(err => {
            return err;
        });


        //Mais complexo o SQL de banco do que fazer esse FOR
        for(var i = 0; i < tarefas.length; i++){
            tarefas[i].ordem = (Number(tarefas[i].frequenciauso) + Number(tarefas[i].prioridade))
            tarefas[i].usado = 'N'
        }

        if (tarefas.length > 1) {
            tarefas.sort((a, b) => {
                return new Number(b.ordem) - new Number(a.ordem); // descending
            } )
        }
        
        for(var i = 0; i < sprint.length; i++){

            var idSPRINT = sprint[i].idsprint;
            var CapacidadeSprint = sprint[i].estimativa;
            var CapacidadeSobra = 0;

            const [CapacideAlocadaAtual] = await connection('tarefa').where('idsprint',idSPRINT).sum('estimativa');

            if (CapacideAlocadaAtual.sum > 0) {
                CapacidadeSobra = CapacidadeSprint - CapacideAlocadaAtual
            } else {
                CapacidadeSobra = CapacidadeSprint
            }

        
            for( var j = 0; j < tarefas.length; j++){
            
                if( tarefas[j].usado == 'S') continue

                if(CapacidadeSobra >= tarefas[j].estimativa){
                    
                    CapacidadeSobra = CapacidadeSobra - tarefas[j].estimativa

                    const [idtarf] = await connection('tarefa').update({ 
                        idsprint : idSPRINT
                    }).where('idtarefa',tarefas[j].idtarefa).returning('idtarefa').catch(err => {
                        return err;
                    });

                    if (!(idtarf > 0)) {
                        return response.status(401).json({ error: 'Houve Problemas no processador de Sprint!'});
                    }

                    tarefas[j].usado = 'S'

                }

            } 

        }

        return response.json({ sucesso: 'Operação efetuada com Sucesso!'});
    },

}; 