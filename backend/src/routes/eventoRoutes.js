import { Router } from 'express';
import { eventoController } from '../controllers/eventoController.js';

const router = Router();

router.get('/eventos', eventoController.getAll);
router.get('/eventos/:id', eventoController.get);
router.post('/eventos', eventoController.create);
router.put('/eventos/:id', eventoController.update);
router.delete('/eventos/:id', eventoController.delete);

export default router;