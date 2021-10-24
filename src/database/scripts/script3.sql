CREATE TABLE ESTORIA_USUARIO (
	IDESTORIA SERIAL PRIMARY KEY,
	NOME VARCHAR(200),
	STATUS VARCHAR(1),
	PRIORIDADE VARCHAR(1),
	DESCRICAO VARCHAR(2000),
	IDPROJETO INTEGER,
	CONSTRAINT FK_ESTORIA_PROJETO_ID FOREIGN KEY (IDPROJETO) REFERENCES PROJETO(IDPROJETO)
);

CREATE TABLE USUARIO_ESTORIA_USUARIO (
	IDESTORIA INTEGER,
	IDUSUARIO INTEGER,
	PRIMARY KEY (IDESTORIA, IDUSUARIO),
	CONSTRAINT FK_USUESTUSU_ESTORIA_ID FOREIGN KEY (IDESTORIA) REFERENCES ESTORIA_USUARIO(IDESTORIA),
	CONSTRAINT FK_USUESTUSU_USUARIO_ID FOREIGN KEY (IDUSUARIO) REFERENCES USUARIO(IDUSUARIO)
);

INSERT INTO TABELAS(NOME, COLUNAS, DESCRICAO) VALUES
('ESTORIA_USUARIO','IDESTORIA, NOME, STATUS, PRIORIDADE, DESCRICAO, IDPROJETO', 'TABELA DE ESTORIAS DE USUARIO'),
('USUARIO_ESTORIA_USUARIO','IDUSUARIO, IDESTORIA', 'TABELA DE RELACIONAMENTO USUARIO E ESTORIAS');

CREATE TABLE SPRINT(
	IDSPRINT SERIAL PRIMARY KEY,
	TITULO VARCHAR(200),
	DATAINI DATE,
	DATAFIM DATE,
	IDPROJETO INTEGER,
	CONSTRAINT FK_SPRINT_PROJETO_PROJETO_ID FOREIGN KEY (IDPROJETO) REFERENCES PROJETO(IDPROJETO)
);

CREATE TABLE TAREFA
(
	IDTAREFA SERIAL,
	DESCRICAO VARCHAR(1000),
	STATUS VARCHAR(1),
	ESTIMATIVA DEC(11,2),
	PRIORIDADE VARCHAR(1),
	IDESTORIA INTEGER,
	IDSPRINT INTEGER,
	CONSTRAINT FK_TARESTUSU_ESTORIA_ID FOREIGN KEY (IDESTORIA) REFERENCES ESTORIA_USUARIO(IDESTORIA),
	CONSTRAINT FK_TARSPRINT_SPRINT_ID FOREIGN KEY (IDSPRINT) REFERENCES SPRINT(IDSPRINT)
);

INSERT INTO TABELAS(NOME, COLUNAS, DESCRICAO) VALUES
('SPRINT','IDSPRINT, TITULO, DATAINI, DATAFIM, IDPROJETO', 'TABELA DE SPRINTS'),
('TAREFA','IDTAREFA, DESCRICAO, STATUS, ESTIMATIVA, PRIORIDADE, IDESTORIA, IDSPRINT', 'TABELA DE TAREFAS');

ALTER TABLE SPRINT ADD ESTIMATIVA DEC(11,2)

alter table projeto add personas varchar(2000)

alter table estoria_usuario add aceite varchar(2000)

alter table tarefa add frequenciauso varchar(1) default '5'

CREATE TABLE LOG_TABELAS(
	IDLOG SERIAL PRIMARY KEY,
	ALTERACAO VARCHAR(10000),
	DT_ALTERACAO DATE default CURRENT_DATE,
	HR_ALTERACAO TIME default CURRENT_TIME,
	TABELA VARCHAR(100)
)

alter table log_Tabelas add idprojeto integer
alter table log_Tabelas add CONSTRAINT FK_LOGS_PROJETO_PROJETO_ID FOREIGN KEY (IDPROJETO) REFERENCES PROJETO(IDPROJETO)

ALTER TABLE usuario ALTER COLUMN senha TYPE varchar(400)

ALTER TABLE ESTORIA_USUARIO ADD PERSONA VARCHAR(2000)
ALTER TABLE ESTORIA_USUARIO ADD DESEJO VARCHAR(2000)

ALTER TABLE SPRINT ADD ARQUIVADO VARCHAR(1) DEFAULT 'N'

CREATE TABLE CRITERIO_ACEITE(
	IDCRITERIO SERIAL PRIMARY KEY,
	CENARIO VARCHAR(2000),
	DADO VARCHAR(2000),
	QUANDO VARCHAR(2000),
	ENTAO VARCHAR(2000),
	IDESTORIA INTEGER,
	CONSTRAINT FK_CRITERIOACEITE_ESTORIA_ID FOREIGN KEY (IDESTORIA) REFERENCES ESTORIA_USUARIO(IDESTORIA)
)