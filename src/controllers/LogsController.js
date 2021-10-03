const connection = require('../database/connection');

module.exports = {

    async getLogProjetos(request, response){
        const { dataini, datafim, idusuario } = request.body;
        const idprojeto = request.headers.authorization;

        const Projetos = await connection('log_tabelas')
        .select('*').orderBy('dt_alteracao','desc')
        .whereBetween('log_tabelas.dt_alteracao', [dataini,datafim])
        .where('log_tabelas.tabela','Projeto')
        .andWhere('log_tabelas.idprojeto', idprojeto).catch(err => {
            return err;
        });
        
        return response.json(Projetos);
        
    },

    async getLogEU(request, response){
        const { dataini, datafim, idusuario } = request.body;
        const idprojeto = request.headers.authorization;

        const EU = await connection('log_tabelas')
        .select('*').orderBy('dt_alteracao','desc')
        .where('log_tabelas.idprojeto', idprojeto)
        .whereBetween('log_tabelas.dt_alteracao', [dataini,datafim])
        .andWhere('log_tabelas.tabela','Estoria_Usuario').catch(err => {
            return err;
        });
  
        return response.json(EU);
    },

    async getLogSprint(request, response){
        const { dataini, datafim, idusuario } = request.body;
        const idprojeto = request.headers.authorization;


        const sprint = await connection('log_tabelas')
        .select('*').orderBy('dt_alteracao','desc')
        .where('log_tabelas.idprojeto', idprojeto)
        .whereBetween('log_tabelas.dt_alteracao', [dataini,datafim])
        .andWhere('log_tabelas.tabela','Sprint').catch(err => {
            return err;
        });
        
        
        return response.json(sprint);
    },

    async getLogTarefa(request, response){
        const { dataini, datafim, idusuario } = request.body;
        const idprojeto = request.headers.authorization;

        const tarefas = await connection('log_tabelas')
        .select('*').orderBy('dt_alteracao','desc')
        .whereBetween('log_tabelas.dt_alteracao', [dataini,datafim])
        .andWhere('log_tabelas.idprojeto', idprojeto)
        .andWhere('log_tabelas.tabela','Tarefa').catch(err => {
            return err;
        });
        
        
        return response.json(tarefas);
    },

   
}