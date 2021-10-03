
exports.up = function(knex) {
    return knex.schema.createTable('estoria_usuario', function(table){
        table.increments();
        table.string('nome').notNullable();
        table.string('status').notNullable();
        table.string('prioridade').notNullable();
        table.string('descricao').notNullable();

        table.string('idusuario').notNullable();

        table.foreign('idusuario').references('idusuario').inTable('usuario')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('estoria_usuario')
  };
  