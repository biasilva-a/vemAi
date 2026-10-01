import { query } from '../config/db.js';

export const usuarioRepository = {


    async findById(id_usuario) {

        const sql = `
            SELECT
                id_usuario,
                nome,
                email
            FROM public.usuarios
            WHERE id_usuario = $1;
        `;

        const res = await query(sql, [id_usuario]);

        return res.rows[0];
    },


    async findByEmail(email) {

        const sql = `
            SELECT *
            FROM public.usuarios
            WHERE email = $1;
        `;

        const res = await query(sql, [email]);

        return res.rows[0];
    },

    async create(usuario) {

        const { nome, email, senha } = usuario;

        const sql = `
            INSERT INTO public.usuarios
            (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING id_usuario, nome, email;
        `;

        const res = await query(sql, [
            nome,
            email,
            senha
        ]);

        return res.rows[0];
    },



    async login(email, senha) {

        const sql = `
            SELECT
                id_usuario,
                nome,
                email
            FROM public.usuarios
            WHERE email = $1
            AND senha = $2;
        `;

        const res = await query(sql, [
            email,
            senha
        ]);

        return res.rows[0];
    }

};