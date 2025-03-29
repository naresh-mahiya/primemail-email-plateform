import express from 'express'
import { trackEmailRead,createEmail, deleteEmail, getAllEmailsInbox,getAllEmailsSent } from '../controllers/emailCtrl.js';
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router();


router.route('/create').post(isAuthenticated,createEmail);
router.route('/:id').delete(isAuthenticated,deleteEmail);
router.route('/getinbox').get(isAuthenticated,getAllEmailsInbox);
router.route('/getsent').get(isAuthenticated,getAllEmailsSent);
router.route('/imageload/:trackingId').get(trackEmailRead);

export default router