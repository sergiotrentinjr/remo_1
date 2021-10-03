const connection = require('../database/connection');
const crypto = require("crypto");
const secret = 'remoutfpr';

module.exports = {

    async create(request, response){
        const {email} = request.body;
        const {senha} = request.body;

        const hash = crypto.createHmac('sha256', secret).update(senha).digest('hex')

        const usuario = await connection('usuario').where('email',email).andWhere('senha',hash).select('*').first();

        if (!usuario) {
            return response.status(400).json({error: 'Nenhum Usuário encontrado com esse ID'})
        }

        return response.json(usuario);
    },

};