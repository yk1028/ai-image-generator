import { Router } from 'express';
import { handleImageGeneration } from '../controllers/imageController';

const router = Router();

router.post('/generate', handleImageGeneration);

export default router; 