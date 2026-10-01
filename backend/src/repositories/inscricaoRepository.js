import { query } from '../config/db.js';

export const inscricaoRepository = {

    async findAll() {

        const sql = `
            SELECT
                i.id_inscricao,
                i.data_inscricao,
                i.status,
                u.nome AS usuario_nome,
                e.nome AS evento_nome
            FROM public.inscricao i
            JOIN public.usuarios u
                ON i.id_usuario = u.id_usuario
            JOIN public.eventos e
                ON i.id_evento = e.id_eventos
            ORDER BY i.id_inscricao;
        `;

        const res = await query(sql);

        return res.rows;
    },


    async findByUsuario(id_usuario) {

        const sql = `
            SELECT
                i.id_inscricao,
                i.data_inscricao,
                i.status,
                e.*
            FROM public.inscricao i
            JOIN public.eventos e
                ON i.id_evento = e.id_eventos
            WHERE i.id_usuario = $1;
        `;

        const res = await query(sql, [id_usuario]);

        return res.rows;
    },


    async create(id_usuario, id_evento) {

        const sql = `
            INSERT INTO public.inscricao
            (
                id_usuario,
                id_evento,
                data_inscricao,
                status
            )
            VALUES
            (
                $1,
                $2,
                CURRENT_TIMESTAMP,
                'CONFIRMADA'
            )
            RETURNING *;
        `;

        const res = await query(sql, [
            id_usuario,
            id_evento
        ]);

        return res.rows[0];
    },


    async delete(id_inscricao) {

        const sql = `
            DELETE FROM public.inscricao
            WHERE id_inscricao = $1
            RETURNING *;
        `;

        const res = await query(sql, [id_inscricao]);

        return res.rows[0];
    }

};