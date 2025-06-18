import cron from 'node-cron'
import { Email } from '../models/emailModel.js';
import { User } from '../models/userModel.js'

const sendScheduledEmails=async()=>{
try {
    const now =new Date();

    const pendingEmails= await Email.find({status:'pending',scheduledAt:{$lt:now}});
    for(let email of pendingEmails)
    {
        await User.findByIdAndUpdate(email.receiverIds, { $push: { inbox: email._id } });
        email.status='sent';
        await email.save();
    }
    console.log(`Sent ${pendingEmails.length} scheduled emails.`);
} catch (error) {
    console.error("Error sending scheduled emails:", error);
    
}
}

cron.schedule('* * * * *',sendScheduledEmails)
console.log('email schedular is running')