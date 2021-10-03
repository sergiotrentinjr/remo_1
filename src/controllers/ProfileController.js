const connection = require('../database/connection');

module.exports = {

    async index(request, response){
        const idusuario = request.headers.authorization;

        //PARA PEGAR APENAS DO USUARIO Q ESTOU PASSANDO
        const estoria_usuario = await connection('estoria_usuario').where('idusuario',idusuario).select('*');

        return response.json(estoria_usuario);
    },

};