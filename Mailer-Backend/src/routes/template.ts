import { Router } from 'express';
import { createTemplateController } from '../controllers/template';

const router = Router();
router.post('/', createTemplateController);

export { router as templateRouter };
