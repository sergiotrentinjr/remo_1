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

        const IdUsuario = await connection('usuario').insert({
                nome,
                senha  : hash,
                nomeusuario,
                email,
            }).catch(err => {
                return err;
            });
            
        if(!(IdUsuario > 0)){
            return response.status(400).json({error: 'Não Foi possível Cadastrar esse Usuário!'})
        }

        return response.json({nomeusuario});
    }
}