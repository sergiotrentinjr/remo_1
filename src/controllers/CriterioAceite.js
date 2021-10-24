const connection = require('../database/connection');

module.exports = {

    async get(request, response){
        const {id} = request.params;
        const criterios = await connection('criterio_aceite').select('*').where('idestoria',id);
        return response.json(criterios);
    },

    async create (request, response){
        const { cenario, dado, quando, entao } = request.body;
        const id = request.headers.authorization;

        const idCriterio = await connection('criterio_aceite').insert({
            cenario, 
            dado, 
            quando, 
            entao,
            idestoria : id
        }).returning('idcriterio').catch(err => {
            return err;
        });

        if (!idCriterio){
            return response.json({ retorno: "Houve problemas ao cadastrar o Critério de Aceite!" })
        }
    
        return response.json({ retorno: "Cadastro Realizado Com Sucesso!" })
    },

    async delete (request, response){
        const {id} = request.params;
        const idestoria = request.headers.authorization;

        const [estoria_usuario] = await connection('criterio_aceite')
        .join('estoria_usuario', 'estoria_usuario.idestoria', '=', 'criterio_aceite.idestoria')
        .where('criterio_aceite.idcriterio', id).select('criterio_aceite.*');

        console.log(estoria_usuario.idestoria)

        if (estoria_usuario.idestoria != idestoria) {
            return response.status(401).json({ retorno: 'Operação não permitida!'});
        }

        await connection('criterio_aceite').where('idcriterio', id).delete().catch(err => {
            return err;
        });

        return response.status(204).json({ retorno: 'Critério excluido com Sucesso!'});
    },

}