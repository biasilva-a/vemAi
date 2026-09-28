import express from 'express';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import eventoRoutes from '../routes/eventoRoutes.js';
import inscricaoRoutes from '../routes/inscricaoRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api', eventoRoutes);
app.use('/api', inscricaoRoutes);

app.listen(PORT, () => {
    console.log(` Servidor do VemAí rodando na porta: ${PORT}...`);
});