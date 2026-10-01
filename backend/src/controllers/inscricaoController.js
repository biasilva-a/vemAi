import { query } from "../config/db.js";

export const inscricaoController = {

    async create(req, res) {

        const { id_usuario, id_evento } = req.body;


        if (!id_usuario || !id_evento) {
            return res.status(400).json({
                erro: "Usuário e evento são obrigatórios."
            });
        }


        const resposta = await query(
            `INSERT INTO public.inscricao
            (
                id_usuario,
                id_evento,
                data_inscricao,
                status
            )
            VALUES
            ($1, $2, CURRENT_TIMESTAMP, 'CONFIRMADA')
            RETURNING *;`,
            [id_usuario, id_evento]
        );


        res.status(201).json(resposta.rows[0]);
    },


    async getByUser(req, res) {

        const { id } = req.params;

        const resposta = await query(
            `SELECT
                i.id_inscricao,
                i.data_inscricao,
                i.status,
                e.*
             FROM public.inscricao i
             JOIN public.eventos e
                ON i.id_evento = e.id_eventos
             WHERE i.id_usuario = $1
             ORDER BY i.data_inscricao DESC;`,
            [id]
        );


        res.status(200).json(resposta.rows);
    },


    async delete(req, res) {

        const { id } = req.params;

        const resposta = await query(
            `DELETE FROM public.inscricao
             WHERE id_inscricao = $1
             RETURNING *;`,
            [id]
        );


        if (resposta.rows.length === 0) {
            return res.status(404).json({
                erro: "Inscrição não encontrada."
            });
        }


        res.status(200).json({
            mensagem: "Inscrição cancelada com sucesso.",
            inscricao: resposta.rows[0]
        });
    }
};