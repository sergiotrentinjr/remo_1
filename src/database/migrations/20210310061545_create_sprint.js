
exports.up = function(knex) {
    return knex.schema.createTable('sprint', function(table){
        table.increments();
        table.string('nome').notNullable();
        table.string('dataini').notNullable();
        table.string('datafim').notNullable();
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sprint')
  };
  