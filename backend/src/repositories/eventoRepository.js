import { query } from '../config/db.js';

export const eventoRepository = {

    async findAll() {

        const sql = `
            SELECT 
                e.*,
                u.nome AS nome_criador
            FROM public.eventos e
            JOIN public.usuarios u
                ON e.id_usuario = u.id_usuario
            ORDER BY e.id_eventos;
        `;

        const res = await query(sql);

        return res.rows;
    },


    async findById(id_eventos) {

        const sql = `
            SELECT 
                e.*,
                u.nome AS nome_criador,
                u.email AS email_criador
            FROM public.eventos e
            JOIN public.usuarios u
                ON e.id_usuario = u.id_usuario
            WHERE e.id_eventos = $1;
        `;

        const res = await query(sql, [id_eventos]);

        return res.rows[0];
    },


    async create(evento) {

        const {
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas,
            id_usuario
        } = evento;

        const sql = `
            INSERT INTO public.eventos
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
            RETURNING *;
        `;

        const res = await query(sql, [
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas,
            id_usuario
        ]);

        return res.rows[0];
    },


    async update(id_eventos, evento) {

        const {
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas
        } = evento;

        const sql = `
            UPDATE public.eventos
            SET
                nome = $1,
                descricao = $2,
                data = $3,
                horario = $4,
                local = $5,
                categoria = $6,
                vagas = $7
            WHERE id_eventos = $8
            RETURNING *;
        `;

        const res = await query(sql, [
            nome,
            descricao,
            data,
            horario,
            local,
            categoria,
            vagas,
            id_eventos
        ]);

        return res.rows[0];
    },


    async delete(id_eventos) {

        const sql = `
            DELETE FROM public.eventos
            WHERE id_eventos = $1
            RETURNING *;
        `;

        const res = await query(sql, [id_eventos]);

        return res.rows[0];
    }

};