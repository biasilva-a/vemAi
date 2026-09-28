CREATE TABLE IF NOT EXISTS public.eventos
(
    id_eventos serial NOT NULL,
    nome character varying COLLATE pg_catalog."default" NOT NULL,
    descricao text COLLATE pg_catalog."default" NOT NULL,
    data date NOT NULL,
    horario time with time zone NOT NULL,
    local character varying COLLATE pg_catalog."default" NOT NULL,
    categoria character varying COLLATE pg_catalog."default" NOT NULL,
    vagas integer NOT NULL,
    id_usuario integer NOT NULL,
    CONSTRAINT eventos_pkey PRIMARY KEY (id_eventos)
);

CREATE TABLE IF NOT EXISTS public.inscricao
(
    id_inscricao serial NOT NULL,
    id_usuario integer NOT NULL,
    id_evento integer NOT NULL,
    data_inscricao timestamp with time zone NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT inscricao_pkey PRIMARY KEY (id_inscricao)
);

CREATE TABLE IF NOT EXISTS public.usuarios
(
    id_usuario serial NOT NULL,
    nome character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    senha character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);

ALTER TABLE IF EXISTS public.eventos
    ADD CONSTRAINT eventos_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.usuarios (id_usuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.inscricao
    ADD CONSTRAINT inscricao_id_evento_fkey FOREIGN KEY (id_evento)
    REFERENCES public.eventos (id_eventos) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.inscricao
    ADD CONSTRAINT inscricao_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.usuarios (id_usuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

INSERT INTO public.usuarios (nome, email, senha) VALUES
('Carlos Silva', 'carlos.silva@email.com', '123456'),
('Ana Souza', 'ana.souza@email.com', '1234567'),
('Mariana Costa', 'mariana.costa@email.com', '12345678');


INSERT INTO public.eventos (nome, descricao, data, horario, local, categoria, vagas, id_usuario) VALUES
('Tech Conference 2026', 'A maior conferência de tecnologia e programação do ano.', '2026-10-15', '09:00:00-03', 'Centro de Convenções - Auditório A', 'Tecnologia', 150, 1),
('Workshop de Node.js e Express', 'Aprenda a construir APIs REST do zero com Node e Express.', '2026-11-05', '14:00:00-03', 'Rua das Flores, 123 - Sala 302', 'Educação', 30, 1),
('Festival VemAí de Música', 'Show ao vivo com diversas bandas locais e gastronomia.', '2026-12-01', '18:30:00-03', 'Parque Central', 'Música', 500, 2);

INSERT INTO public.inscricao (id_usuario, id_evento, data_inscricao, status) VALUES
(2, 1, CURRENT_TIMESTAMP, 'CONFIRMADA'), 
(3, 1, CURRENT_TIMESTAMP, 'CONFIRMADA'),
(2, 2, CURRENT_TIMESTAMP, 'CONFIRMADA'), 
(3, 3, CURRENT_TIMESTAMP, 'PENDENTE');

SELECT inscricao.id_inscricao, usuarios.nome, usuarios.email, inscricao.data_inscricao, inscricao.status
	FROM public.inscricao
		JOIN public.usuarios ON inscricao.id_usuario = usuarios.id_usuario;
