import { query } from "../config/db.js";

export const usuarioController = {

    async getAll(req, res) {

        const resposta = await query(
            `SELECT
            usuarios.id_usuario,
            usuarios.nome,
            usuarios.email
         FROM public.usuarios
         ORDER BY usuarios.id_usuario;`
        );

        res.status(200).json(resposta.rows);
    },

    async login(req, res) {

        console.log(req.body);

        const { email, senha } = req.body;

        if (!email) {
            return res.status(400).json({
                erro: "E-mail inválido ou vazio."
            });
        }

        if (!senha) {
            return res.status(400).json({
                erro: "A senha é obrigatória e não pode estar vazia."
            });
        }

        const resposta = await query(
            `SELECT * 
             FROM public.usuarios
             WHERE email = $1 AND senha = $2;`,
            [email, String(senha)]
        );

        const usuario = resposta.rows[0];

        if (usuario) {

            res.status(200).json({
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            });

        } else {

            return res.status(404).json({
                erro: "Usuário não encontrado ou senha incorreta"
            });
        }
    },


    async create(req, res) {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, e-mail e senha são obrigatórios."
            });
        }

        const resposta = await query(
            `INSERT INTO public.usuarios
             (nome, email, senha)
             VALUES ($1, $2, $3)
             RETURNING id_usuario, nome, email;`,
            [nome, email, senha]
        );

        res.status(201).json(resposta.rows[0]);
    },


    async get(req, res) {

        const { id } = req.params;

        const resposta = await query(
            `SELECT id_usuario, nome, email
             FROM public.usuarios
             WHERE id_usuario = $1;`,
            [id]
        );

        const usuario = resposta.rows[0];

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        res.status(200).json(usuario);
    }
};