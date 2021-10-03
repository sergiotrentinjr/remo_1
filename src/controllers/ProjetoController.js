const connection = require('../database/connection');

module.exports = {

    async get(request, response){
        const {id} = request.params;
        const projetos = await connection('projeto').select('*').where('idprojeto',id);
        return response.json(projetos);
    },

    async index(request, response){
        const idusuario = request.headers.authorization;
        const projetos = await connection('projeto')
        .join('projeto_usuario','projeto_usuario.idprojeto','=','projeto.idprojeto')
        .select('projeto.*').where('projeto_usuario.idusuario',idusuario).orderBy('projeto.idprojeto','asc');
        return response.json(projetos);
    },

    async create(request, response){
        const {titulo, descricao, personas} = request.body;
        const idusuario = request.headers.authorization;
        

        if (titulo == null || descricao == null){
            return response.status(401).json({ error: 'Título Nulo.'});
        }

        const [idprojeto] = await connection('projeto').insert({
            titulo,
            descricao,
            personas,
        }).returning('idprojeto').catch(err => {
            return err;
        });

        if (idprojeto <= 0 || idprojeto == null) {
            return response.json({Error});
        }

        const tipoacesso = 1

        const [id] = await connection('projeto_usuario').insert({
            idprojeto,
            idusuario,
            tipoacesso
        }).returning('idprojeto').catch(err => {
            return err;
        });

        if (id <= 0 || id == null) {
            return response.json({Error});
        }
        
        return response.json({id});
    },

    async insertUsuarioProjeto(request, response){
        const {idprojeto, email} = request.body;
        const idusuario = request.headers.authorization;
        
        const tipoacesso = 1

        const [usuario] = await connection('usuario')
        .select('usuario.nome','usuario.email', 'usuario.idusuario').where('usuario.email',email).catch(err => {
            return err;
        });

        const [id] = await connection('projeto_usuario').insert({
            idprojeto,
            idusuario : usuario.idusuario,
            tipoacesso
        }).returning('idprojeto').catch(err => {
            return err;
        });

        if (id <= 0 || id == null) {
            return response.json({Error});
        }
        
        return response.json({id});
    },

    async deleteUsuarioProjeto (request, response){
        const {id} = request.params;
        const idprojeto = request.headers.authorization;

        console.log(id)
        console.log(idprojeto)

        const estoria_usuario = await connection('projeto_usuario').where('idusuario', id).select('idusuario').first();

        if (estoria_usuario.idusuario != id) {
            return response.status(401).json({ error: 'Operação não permitida.'});
        }

        await connection('projeto_usuario').where('idprojeto', idprojeto).andWhere('idusuario',id).delete().catch(err => {
            return err;
        });

        return response.status(204).send();
    },

    async getProjetoUsuario(request, response){
        const idprojeto = request.headers.authorization;

        const projetos = await connection('projeto')
        .join('projeto_usuario', 'projeto_usuario.idprojeto', '=', 'projeto.idprojeto')
        .join('usuario', 'usuario.idusuario', '=', 'projeto_usuario.idusuario')
        .select('usuario.nome','usuario.email', 'usuario.idusuario').where('projeto.idprojeto',idprojeto).catch(err => {
            return err;
        });

        return response.json(projetos);
    },

    async update (request, response){
        const {id} = request.params;
        const {titulo, descricao, personas} = request.body;
        const idusuario = request.headers.authorization;
        let Logs = '';

        const [ProjetoAntigo] = await connection('projeto')
        .join('projeto_usuario', 'projeto_usuario.idprojeto', '=', 'projeto.idprojeto')
        .join('usuario', 'usuario.idusuario', '=', 'projeto_usuario.idusuario')
        .select('projeto.*', 'usuario.nome as usuarionome', 'usuario.email as email')
        .where({'projeto.idprojeto': id, 'usuario.idusuario' : idusuario}).catch(err => {
            return err;
        });

        Logs = "Alteração Feita por: " +  ProjetoAntigo.usuarionome + ", e-mail: "+ ProjetoAntigo.email +
        "  - Dado Antigo { Título: " + ProjetoAntigo.titulo + ", Descrição: " + ProjetoAntigo.descricao +  ', Personas: ' + ProjetoAntigo.personas + 
        '}. Dado Novo {'+' Título: '+ titulo + ', Descrição: ' + descricao + ', Personas: ' + personas + '}'


        const [idprojeto] = await connection('projeto').update({titulo, descricao, personas}).where('idprojeto',id).returning('idprojeto').catch(err => {
            return err;
        });;

        if (idprojeto <= 0 || idprojeto == null) {
            return response.status(401).json({ error: 'Houve Problemas na Alteração do Projeto!'});
        }

        await connection('log_tabelas').insert({
            alteracao: Logs, 
            tabela: 'Projeto',
            idprojeto: id,
        }).catch(err => {
            return err;
        });

        return response.json({ idprojeto: idprojeto });
    },

}