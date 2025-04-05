import express from 'express'
import { trackEmailRead,createEmail,replyToEmail ,deleteEmail, getAllEmailsInbox,getAllEmailsSent, getEmailThread, forwardEmail } from '../controllers/emailCtrl.js';
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router();


router.route('/create').post(isAuthenticated,createEmail);
router.route('/delete/:id').delete(isAuthenticated,deleteEmail);
router.route('/reply/:id').post(isAuthenticated,replyToEmail);
router.route('/forward/:id').post(isAuthenticated,forwardEmail);
router.route('/getinbox').get(isAuthenticated,getAllEmailsInbox);
router.route('/getsent').get(isAuthenticated,getAllEmailsSent);
router.route('/imageload/:trackingId').get(trackEmailRead);
router.route('/thread/:threadId').get(isAuthenticated,getEmailThread);

export default router