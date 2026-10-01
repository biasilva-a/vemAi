import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';

const router = Router();
router.get('/usuarios', usuarioController.getAll);
router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);
router.get('/usuarios/:id', usuarioController.get);

export default router;