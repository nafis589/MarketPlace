import { Router } from 'express';
import { removeBgUrl } from '../controllers/imageController';
import { checkApiKey } from '../middleware/auth';

const router = Router();

router.post('/remove-bg-url', checkApiKey, removeBgUrl);

export default router;
