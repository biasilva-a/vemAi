import { query } from '../config/db.js';

export const inscricaoRepository = {
    async findAll() {
        const sql = `
            SELECT i.id_inscricao, i.data_inscricao, 
                   u.nome AS usuario_nome, e.nome AS evento_nome 
            FROM public.inscricoes i
            JOIN public.usuarios u ON i.id_usuario = u.id_usuario
            JOIN public.eventos e ON i.id_evento = e.id_evento
            ORDER BY i.id_inscricao;
        `;
        const res = await query(sql);
        return res.rows;
    },

    async findByUsuario(id_usuario) {
        const sql = `
            SELECT i.id_inscricao, i.data_inscricao, e.* 
            FROM public.inscricoes i
            JOIN public.eventos e ON i.id_evento = e.id_evento
            WHERE i.id_usuario = $1;
        `;
        const res = await query(sql, [id_usuario]);
        return res.rows;
    },

    async create(id_usuario, id_evento) {
        const sql = `
            INSERT INTO public.inscricoes (id_usuario, id_evento) 
            VALUES ($1, $2) RETURNING *;
        `;
        const res = await query(sql, [id_usuario, id_evento]);
        return res.rows[0];
    },

    async delete(id_inscricao) {
        const res = await query('DELETE FROM public.inscricoes WHERE id_inscricao = $1 RETURNING *;', [id_inscricao]);
        return res.rows[0];
    }
};