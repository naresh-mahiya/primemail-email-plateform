import { Email } from "../models/emailModel.js";
import { User } from '../models/userModel.js'
import crypto from "crypto";

export const createEmail = async (req, res) => {
    try {
        const userId = req.id;//we saved it during login
        const { to, subject, message, scheduledAt } = req.body;
        const receiver = await User.findOne({ email: to });
        if (!receiver)
            return res.status(404).json({ message: 'recipient not found' })
        if (!to || !subject || !message)
            return res.status(400).json({ message: 'All fields are required' });

        const status = scheduledAt ? 'pending' : 'sent';

        const trackingId = crypto.randomBytes(16).toString('hex')

        const email = await Email.create({
            to, subject, message,
            senderId: userId,
            receiverId: receiver._id,
            scheduledAt: scheduledAt || null,
            status,
            trackingId
        })

        if (!scheduledAt) {
            await User.findByIdAndUpdate(userId, { $push: { sent: email._id } })
            await User.findByIdAndUpdate(receiver._id, { $push: { inbox: email._id } })
        }
        else {
            await User.findByIdAndUpdate(userId, { $push: { sent: email._id } })
            //only in sentbox, not in inbox of receiver
        }

        // return res.status(201).json({message:'Email composed successfully', email});//any use of email???
        return res.status(201).json({ message: scheduledAt ? 'Email scheduled successfully' : 'Email sent successfully', email });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteEmail = async (req, res) => {
    try {
        const emailId = req.params.id
        if (!emailId)
            return res.status(400).json({ message: 'Email id is required' });

        const email = await Email.findById(emailId);

        if (!email)
            return res.status(400).json({ message: 'Email is not found' });

        await User.findByIdAndUpdate(email.receiverId, { $pull: { inbox: emailId } })//delete from receiver's inbox
        await User.findByIdAndUpdate(email.senderId, { $pull: { sent: emailId } })//delete from sender's sentbox
        await Email.findByIdAndDelete(emailId);
        return res.status(200).json({ message: 'Email is deleted successfully' });
    } catch (error) {
        console.log(error)
    }
}

export const getAllEmailsInbox = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'inbox',
            populate: { path: 'senderId', select: 'fullname email' }
        })
        //send emails from inbox
        return res.status(200).json({ emails: user.inbox })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}

export const getAllEmailsSent = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'sent',
            populate: { path: 'receiverId', select: 'fullname email' }
        })

        return res.status(200).json({ emails: user.sent })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}

export const trackEmailRead = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const email = await Email.findOne({ trackingId });

        if (email && !email.read) {
            email.read = true;
            await email.save();
        }

        //send transparent 1x1 image
        res.setHeader('content-Type', 'image/png');
        res.send(Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ulv+KYAAAAASUVORK5CYII=',
            'base64'
        ))
    } catch (error) {
         console.log('Error from trackEmailId',error)
    }
}