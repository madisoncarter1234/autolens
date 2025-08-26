import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ message: 'media endpoint' }); });
export default router;
