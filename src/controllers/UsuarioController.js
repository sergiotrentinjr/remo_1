const connection = require('../database/connection');
const crypto = require("crypto");
const secret = 'remoutfpr';

module.exports = {

    async index(request, response){
        const usuarios = await connection('usuario').select('*');

        return response.json(usuarios);
    },

    async create(request, response){
        const {nome, senha, nomeusuario, email} = request.body;

        const hash = crypto.createHmac('sha256', secret).update(senha).digest('hex')

        await connection('usuario').insert({
                nome,
                senha  : hash,
                nomeusuario,
                email,
            }).catch(err => {
                return err;
            });

        return response.json({sucesso: 'Cadastro Realizado com Sucesso!'});
    }
}