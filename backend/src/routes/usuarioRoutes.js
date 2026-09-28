import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';

const router = Router();

router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);
router.get('/usuarios/:id', usuarioController.get);

export default router;