const { create } = require("./UsuarioController");

const connection = require('../database/connection');


module.exports = {

    async get(request, response){
        const {id} = request.params;
        const tarefa = await connection('tarefa').select('*').where('idtarefa',id);
        return response.json(tarefa);
    },

    async index(request, response){
        const idprojeto = request.headers.authorization;
        const tarefa = await connection('tarefa')
        .join('estoria_usuario', 'estoria_usuario.idestoria', '=', 'tarefa.idestoria')
        .join('projeto', 'projeto.idprojeto', '=', 'estoria_usuario.idprojeto')
        .leftJoin('sprint', 'sprint.idsprint', '=', 'tarefa.idsprint')
        .select('tarefa.*','estoria_usuario.nome as funcionalidade','sprint.titulo as descrsprint',)
        .orderBy('sprint.idsprint','desc')
        .orderBy('tarefa.status','asc')
        .where('projeto.idprojeto',idprojeto);

        return response.json(tarefa);
    },

    async indexDoc(request, response){
        const idprojeto = request.headers.authorization;
        const tarefa = await connection('tarefa')
        .join('estoria_usuario', 'estoria_usuario.idestoria', '=', 'tarefa.idestoria')
        .select('tarefa.*')
        .orderBy('tarefa.idestoria','asc')
        .where('estoria_usuario.idprojeto',idprojeto);

        return response.json(tarefa);
    },

    async create (request, response){
        const { descricao, status, estimativa, prioridade, frequenciauso, idestoria, idsprint } = request.body;
        const idUsuario = request.headers.authorization;

        if(idsprint > 0){ 

            const [idprojeto] = await connection('tarefa').insert({
                    descricao, 
                    status, 
                    estimativa, 
                    prioridade, 
                    frequenciauso,
                    idestoria, 
                    idsprint,
                }).returning('idtarefa').catch(err => {
                    return err;
            });
            
            return response.json({idprojeto})
        }else{
            const [idprojeto] = await connection('tarefa').insert({
                descricao, 
                status, 
                estimativa, 
                prioridade, 
                frequenciauso,
                idestoria, 
                
            }).returning('idtarefa').catch(err => {
                return err;
            });
            
            return response.json({idprojeto})
        }
    
        
    },

    async update (request, response){
        const {id} = request.params;
        const { descricao, status, estimativa, prioridade, frequenciauso, idestoria, idsprint } = request.body;
        const idUsuario = request.headers.authorization;
        let statusantigo = '';
        let statusnovo = '';
        let frequenciaantigo = '';
        let frequencianovo = '';
        let prioridadeantigo = '';
        let prioridadenovo = '';
        let SprintNova = ' null ';
        let EUNova = '';
        let Logs = '';
        let idproje;
       
        /* log manual */
        const [TarefaAntiga] = await connection('tarefa')
        .join('estoria_usuario','estoria_usuario.idestoria', '=', 'tarefa.idestoria')
        .join('projeto_usuario', 'projeto_usuario.idprojeto', '=', 'estoria_usuario.idprojeto')
        .join('usuario', 'usuario.idusuario', '=', 'projeto_usuario.idusuario')
        .leftJoin('sprint', 'sprint.idsprint', '=', 'tarefa.idsprint')
        .select('tarefa.*', 'projeto_usuario.idprojeto as codproj', 'sprint.titulo as descrsprint', 'sprint.idsprint', 'estoria_usuario.nome as descreu','usuario.nome as usuarionome', 'usuario.email as email')
        .where({'tarefa.idtarefa': id, 'usuario.idusuario' : idUsuario})
        .catch(err => {
            return err;
        });

        const [estoria_usuario] = await connection('estoria_usuario')
        .select('estoria_usuario.*')
        .where('estoria_usuario.idestoria', idestoria).catch(err => {
            return err;
        });

        EUNova = estoria_usuario.nome
        idproje = TarefaAntiga.codproj

        if( idsprint != null ) {
            const [sprint] = await connection('sprint')
            .select('sprint.*')
            .where('sprint.idsprint', idsprint).catch(err => {
                return err;
            });

            SprintNova = sprint.titulo
        }

        
        if(TarefaAntiga.status == 'A'){
            statusantigo = ' Analisando'
        }else if(TarefaAntiga.status == 'B'){
            statusantigo = ' Analisado'
        }else if(TarefaAntiga.status == 'C'){
            statusantigo = ' Desenvolvendo'
        }else if(TarefaAntiga.status == 'D'){
            statusantigo = ' Desenvolvido'
        }else if(TarefaAntiga.status == 'E'){
            statusantigo = ' Entregue'
        }else {
            statusantigo = ' Testando' 
        }

        if(status == 'A'){
            statusnovo = ' Analisando'
        }else if(status == 'B'){
            statusnovo = ' Analisado'
        }else if(status == 'C'){
            statusnovo = ' Desenvolvendo'
        }else if(status == 'D'){
            statusnovo = ' Desenvolvido'
        }else if(status == 'E'){
            statusnovo = ' Entregue'
        }else {
            statusnovo = ' Testando' 
        }

        if(prioridade == '1'){
            prioridadenovo = ' Baixo'
        }else if(prioridade == '3'){
            prioridadenovo = ' Médio'
        }else if(prioridade == '5'){
            prioridadenovo =' Alto'
        }else {
            prioridadenovo = ' Baixo' 
        }

        if(TarefaAntiga.prioridade == '1'){
            prioridadeantigo = ' Baixo'
        }else if(TarefaAntiga.prioridade == '3'){
            prioridadeantigo = ' Médio'
        }else if(TarefaAntiga.prioridade == '5'){
            prioridadeantigo =' Alto'
        }else {
            prioridadeantigo = 'Baixo' 
        }

        if(frequenciauso == '2'){
            frequencianovo = ' Mensal'
        }else if(frequenciauso == '3'){
            frequencianovo = ' Semanal'
        }else if(frequenciauso == '4'){
            frequencianovo =' Diário'
        }else if(frequenciauso == '5'){
            frequencianovo =' Hora a Hora'
        }else {
            frequencianovo = ' Trimestral' 
        }
        
        if(TarefaAntiga.frequenciauso == '2'){
            frequenciaantigo = ' Mensal'
        }else if(TarefaAntiga.frequenciauso == '3'){
            frequenciaantigo = ' Semanal'
        }else if(TarefaAntiga.frequenciauso == '4'){
            frequenciaantigo =' Diário'
        }else if(TarefaAntiga.frequenciauso == '5'){
            frequenciaantigo =' Hora a Hora'
        }else {
            frequenciaantigo = ' Trimestral' 
        }
       
        Logs = "Alteração Feita por: " +  TarefaAntiga.usuarionome + ", E-mail: "+ TarefaAntiga.email +
        "  - Dado Antigo { Descrição: " + TarefaAntiga.descricao + ", Status: " + statusantigo +  ', Estimativa: ' + TarefaAntiga.estimativa
         + ', Valor de Negócio: '+ prioridadeantigo + ', Frequência de Uso: '+ frequenciaantigo + ', Sprint: ' + TarefaAntiga.descrsprint
         + ', Estoria Usuario:' + TarefaAntiga.descreu+' }. Dado Novo {'+
        ' Descrição: '+ descricao + ', Status: ' + statusnovo + ', Estimativa: ' + estimativa + ', Valor de Negócio: '+ prioridadenovo + 
        ' Frequência de Uso: '+ frequencianovo + ', Sprint: ' + SprintNova
         + ', Estoria Usuario: ' + EUNova +'}'

        /* log manual */

        
        const idtarefa = await connection('tarefa').update({
            descricao, 
            status, 
            estimativa, 
            prioridade, 
            frequenciauso,
            idestoria, 
            idsprint
        }).where('idtarefa',id).returning('idtarefa').catch(err => {
            return err;
        });

        await connection('log_tabelas').insert({
            alteracao: Logs, 
            tabela: 'Tarefa',
            idprojeto: idproje,
        }).catch(err => {
            return err;
        });

        if (idtarefa <= 0 || idtarefa == null) {
            return response.status(401).json({ error: 'Houve Problemas na Alteração da Tarefa!'});
        }

        return response.json({ idtarefa: idtarefa });
    },

}; 