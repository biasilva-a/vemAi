import { query } from "../config/db.js";

export const eventoController = {

    async getAll(req, res) {

        const resposta = await query(
            `SELECT 
                e.*,
                u.nome AS nome_criador
             FROM public.eventos e
             JOIN public.usuarios u
                ON e.id_usuario = u.id_usuario
             ORDER BY e.id_eventos;`
        );

        res.status(200).json(resposta.rows);
    },


    async get(req, res) {

        const { id } = req.params;

        const resposta = await query(
            `SELECT 
                e.*,
                u.nome AS nome_criador,
                u.email AS email_criador
             FROM public.eventos e
             JOIN public.usuarios u
                ON e.id_usuario = u.id_usuario
             WHERE e.id_eventos = $1;`,
            [id]
        );

        const evento = resposta.rows[0];

        if (!evento) {
            return res.status(404).json({
                erro: "Evento não encontrado."
            });
        }

        res.status(200).json(evento);
    },


    async create(req, res) {

        const {
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas,
            id_usuario
        } = req.body;


        if (
            !nome ||
            !descricao ||
            !data ||
            !horario ||
            !local ||
            !categoria ||
            !vagas ||
            !id_usuario
        ) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios."
            });
        }


        const resposta = await query(
            `INSERT INTO public.eventos
            (
                nome,
                descricao,
                data,
                horario,
                local,
                categoria,
                vagas,
                id_usuario
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;`,
            [
                nome,
                descricao,
                data,
                horario,
                local,
                categoria,
                vagas,
                id_usuario
            ]
        );


        res.status(201).json(resposta.rows[0]);
    },


    async update(req, res) {

        const { id } = req.params;

        const {
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas
        } = req.body;


        const resposta = await query(
            `UPDATE public.eventos
             SET
                nome = $1,
                descricao = $2,
                data = $3,
                horario = $4,
                local = $5,
                categoria = $6,
                vagas = $7
             WHERE id_eventos = $8
             RETURNING *;`,
            [
                nome,
                descricao,
                data,
                horario,
                local,
                categoria,
                vagas,
                id
            ]
        );


        if (resposta.rows.length === 0) {
            return res.status(404).json({
                erro: "Evento não encontrado."
            });
        }


        res.status(200).json(resposta.rows[0]);
    },


    async delete(req, res) {

        const { id } = req.params;

        const resposta = await query(
            `DELETE FROM public.eventos
             WHERE id_eventos = $1
             RETURNING *;`,
            [id]
        );


        if (resposta.rows.length === 0) {
            return res.status(404).json({
                erro: "Evento não encontrado."
            });
        }


        res.status(200).json({
            mensagem: "Evento removido com sucesso.",
            evento: resposta.rows[0]
        });
    }
};