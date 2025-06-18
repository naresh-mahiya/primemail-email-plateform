import express from 'express';
import { composeEmailAI, summarizeEmailAI ,smartReplyAI } from '../controllers/aiCtrl.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Route to generate an email from a prompt
router.post('/compose', isAuthenticated, composeEmailAI);

// Route to summarize an existing email
router.post('/summarize', isAuthenticated, summarizeEmailAI);

//route to compose smart reply to a mail
router.post('/smart-reply', isAuthenticated, smartReplyAI);

export default router;