import { query } from '../config/db.js';

export const eventoRepository = {
    async findAll() {
        const res = await query('SELECT * FROM public.eventos ORDER BY id_evento;');
        return res.rows;
    },

    async findById(id_evento) {
        const sql = `
            SELECT e.*, u.nome AS nome_criador, u.email AS email_criador 
            FROM public.eventos e
            JOIN public.usuarios u ON e.id_usuario = u.id_usuario
            WHERE e.id_evento = $1;
        `;
        const res = await query(sql, [id_evento]);
        return res.rows[0];
    },

    async create(evento) {
        const { nome, descricao, data, horario, local, categoria, vagas, id_usuario } = evento;
        const sql = `
            INSERT INTO public.eventos (nome, descricao, data, horario, local, categoria, vagas, id_usuario) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const res = await query(sql, [nome, descricao, data, horario, local, categoria, vagas, id_usuario]);
        return res.rows[0];
    },

    async update(id_evento, evento) {
        const { nome, descricao, data, horario, local, categoria, vagas } = evento;
        const sql = `
            UPDATE public.eventos 
            SET nome = $1, descricao = $2, data = $3, horario = $4, local = $5, categoria = $6, vagas = $7 
            WHERE id_evento = $8 RETURNING *;
        `;
        const res = await query(sql, [nome, descricao, data, horario, local, categoria, vagas, id_evento]);
        return res.rows[0];
    },

    async patch(id_evento, evento) {
        const { nome, descricao, data, horario, local, categoria, vagas } = evento;
        const sql = `
            UPDATE public.eventos 
            SET nome = COALESCE($1, nome), 
                descricao = COALESCE($2, descricao), 
                data = COALESCE($3, data), 
                horario = COALESCE($4, horario), 
                local = COALESCE($5, local), 
                categoria = COALESCE($6, categoria), 
                vagas = COALESCE($7, vagas) 
            WHERE id_evento = $8 RETURNING *;
        `;
        const res = await query(sql, [
            nome ?? null,
            descricao ?? null,
            data ?? null,
            horario ?? null,
            local ?? null,
            categoria ?? null,
            vagas ?? null,
            id_evento
        ]);
        return res.rows[0];
    },

    async delete(id_evento) {
        const res = await query('DELETE FROM public.eventos WHERE id_evento = $1 RETURNING *;', [id_evento]);
        return res.rows[0];
    }
};