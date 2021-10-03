
exports.up = function(knex) {
  return knex.schema.createTable('usuario', function(table){
      table.string('idusuario').primary();
      table.string('nome').notNullable();
      table.string('senha').notNullable();
      table.string('nomeusuario').notNullable();
      table.string('email').notNullable();
      //nome, senha, nome do usuário e e-mail

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario')
};
