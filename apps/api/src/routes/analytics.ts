import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ message: 'analytics endpoint' }); });
export default router;
