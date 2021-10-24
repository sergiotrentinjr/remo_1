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

        console.log(senha)

        const [usuarios] = await connection('usuario').select('*').where('email',email);

        if (usuarios) {
            if (usuarios.idusuario > 0) return response.json({erro: 'E-mail já cadastrado!'});
        }

        //const hash = crypto.createHmac('sha256', secret).update(senha).digest('hex')

        const idcadastro =  await connection('usuario').insert({
                nome,
                senha,
                nomeusuario,
                email,
        }).returning('idusuario').catch(err => {
            return err;
        });

        console.log(idcadastro);

        return response.json({sucesso: 'Cadastro Realizado com Sucesso!'});
    }
}