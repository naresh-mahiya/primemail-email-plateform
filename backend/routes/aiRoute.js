import express from 'express';
import { composeEmailAI, summarizeEmailAI } from '../controllers/aiCtrl.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Route to generate an email from a prompt
router.post('/compose', isAuthenticated, composeEmailAI);

// Route to summarize an existing email
router.post('/summarize', isAuthenticated, summarizeEmailAI);

export default router;
