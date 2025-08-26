import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ message: 'organizations endpoint' }); });
export default router;
