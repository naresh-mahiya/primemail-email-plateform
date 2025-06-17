import express from 'express'
import {upload} from '../utils/cloudinary.js'
import { trackEmailRead, createEmail, replyToEmail, deleteEmail, getAllEmailsInbox, getAllEmailsSent, getEmailThread, forwardEmail, starEmail, unstarEmail, getStarredEmails, getEmailById, deleteManyEmails } from '../controllers/emailCtrl.js';
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router();

// Specific routes first
router.route('/create').post(isAuthenticated, upload.array('attachments', 10), createEmail);
router.route('/delete/:id').delete(isAuthenticated, deleteEmail);
router.route('/deleteMany').post(isAuthenticated, deleteManyEmails);
router.route('/getinbox').get(isAuthenticated, getAllEmailsInbox);
router.route('/getsent').get(isAuthenticated, getAllEmailsSent);
router.route('/thread/:threadId').get(isAuthenticated, getEmailThread);
router.route('/star/:id').post(isAuthenticated, starEmail);
router.route('/unstar/:id').post(isAuthenticated, unstarEmail);
router.route('/starred').get(isAuthenticated, getStarredEmails);
router.route('/reply/:id').post(isAuthenticated, upload.array('attachments', 10), replyToEmail);
router.route('/forward/:id').post(isAuthenticated, upload.array('attachments', 10), forwardEmail);
router.route('/track/:trackingId').get(trackEmailRead);

// Generic id route last
router.route('/:id').get(isAuthenticated, getEmailById);

export default router;