import { Router } from 'express';
import { inscricaoController } from '../controllers/inscricaoController.js';

const router = Router();

router.post('/inscricoes', inscricaoController.create);
router.get('/inscricoes/usuario/:id', inscricaoController.getByUser);
router.delete('/inscricoes/:id', inscricaoController.delete);

export default router;