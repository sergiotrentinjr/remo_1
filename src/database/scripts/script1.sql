CREATE table TABELAS (
	idtabela serial not null primary key,
	nome varchar(100),
	colunas varchar(400),
	descricao varchar(400)
);

Insert into tabelas(nome, colunas, descricao) 
values 
('tabela', 'idtabela(PK), nome, colunas, descricao','Tabela de referencia para encontrar outras tabelas');