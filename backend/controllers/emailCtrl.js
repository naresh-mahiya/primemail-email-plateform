import { Email } from "../models/emailModel.js";
import { User } from '../models/userModel.js'
import crypto from "crypto";

export const createEmail = async (req, res) => {
    try {
        const userId = req.id;//we saved it during login
        const { to, subject, message, scheduledAt } = req.body;
        
        // Convert to array if it's a single email
        const recipientEmails = Array.isArray(to) ? to : [to];
        
        if (!recipientEmails.length || !subject || !message)
            return res.status(400).json({ message: 'All fields are required' });

        // Find all recipients
        const receivers = await User.find({ email: { $in: recipientEmails } });
        
        if (receivers.length !== recipientEmails.length)
            return res.status(404).json({ message: 'One or more recipients not found' });

        const receiverIds = receivers.map(receiver => receiver._id);
        const trackingId = crypto.randomBytes(16).toString('hex');
        const threadId = crypto.randomBytes(16).toString('hex'); // Generate new threadId for new email

        const email = await Email.create({
            to: recipientEmails,
            subject,
            message,
            senderId: userId,
            receiverIds,
            scheduledAt: scheduledAt || null,
            status: scheduledAt ? 'pending' : 'sent',
            trackingId,
            threadId,
            isReply: false
        })

        if (!scheduledAt) {
            // Update sender's sent box
            await User.findByIdAndUpdate(userId, { $push: { sent: email._id } });
            
            // Update each receiver's inbox
            for (const receiverId of receiverIds) {
                await User.findByIdAndUpdate(receiverId, { $push: { inbox: email._id } });
            }
        } else {
            await User.findByIdAndUpdate(userId, { $push: { sent: email._id } });
        }

        return res.status(201).json({ 
            message: scheduledAt ? 'Email scheduled successfully' : 'Email sent successfully', 
            email 
        });
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
            populate: [
                { path: 'senderId', select: 'fullname email' },
                { path: 'receiverIds', select: 'fullname email' }
            ],
            options: { sort: { createdAt: -1 } }
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
            populate: [
                { path: 'senderId', select: 'fullname email' },
                { path: 'receiverIds', select: 'fullname email' }
            ],
            options: { sort: { createdAt: -1 } }
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
        console.log('Error from trackEmailId', error)
    }
}

export const replyToEmail = async (req, res) => {
    try {
        const userId = req.id;
        const emailId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Get the original email with populated sender
        const originalEmail = await Email.findById(emailId)
            .populate('senderId', 'email fullname')
            .populate('receiverIds', 'email fullname');
        
        if (!originalEmail) {
            return res.status(404).json({ message: 'Original email not found' });
        }

        // Create the reply email with the same threadId
        const replyEmail = await Email.create({
            to: originalEmail.senderId.email,
            subject: `Re: ${originalEmail.subject}`,
            message: message,
            senderId: userId,
            receiverIds: originalEmail.senderId._id,
            status: 'sent',
            trackingId: crypto.randomBytes(16).toString('hex'),
            threadId: originalEmail.threadId, // Use the same threadId as original
            isReply: true,
            parentEmailId: originalEmail._id
        });

        // Update sender's sent box and receiver's inbox
        await User.findByIdAndUpdate(userId, { $push: { sent: replyEmail._id } });
        await User.findByIdAndUpdate(originalEmail.senderId._id, { $push: { inbox: replyEmail._id } });

        // Populate the reply email with parent email data
        const populatedReply = await Email.findById(replyEmail._id)
            .populate('parentEmailId')
            .populate('senderId', 'fullname email')
            .populate('receiverIds', 'fullname email');

        return res.status(201).json({ 
            message: 'Reply sent successfully',
            email: populatedReply
        });

    } catch (error) {
        console.log('Error in replyToEmail:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Add new endpoint to get email thread
export const getEmailThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Email.find({ threadId })
            .sort({ createdAt: 1 }) // Sort by creation time
            .populate('senderId', 'fullname email')
            .populate({
                path: 'receiverIds',
                select: 'fullname email',
                model: 'User'
            })
            .populate({
                path: 'parentEmailId',
                populate: [
                    { path: 'senderId', select: 'fullname email' },
                    { path: 'receiverIds', select: 'fullname email' }
                ]
            });

        if (!thread || thread.length === 0) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        // Validate and clean up the thread data
        const cleanedThread = thread.map(email => ({
            ...email.toObject(),
            receiverIds: Array.isArray(email.receiverIds) ? email.receiverIds : [],
            senderId: email.senderId || { fullname: 'Unknown Sender', email: 'unknown' }
        }));

        return res.status(200).json({ thread: cleanedThread });
    } catch (error) {
        console.error('Error in getEmailThread:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const forwardEmail = async (req, res) => {
    try {
        const userId = req.id;
        const emailId = req.params.id;
        const { to, message } = req.body;

        if (!to) {
            return res.status(400).json({ message: 'Recipient email is required' });
        }

        // Get the original email with populated sender
        const originalEmail = await Email.findById(emailId)
            .populate('senderId', 'email fullname')
            .populate('receiverIds', 'email fullname');
        
        if (!originalEmail) {
            return res.status(404).json({ message: 'Original email not found' });
        }

        // Convert to array if it's a single email
        const recipientEmails = Array.isArray(to) ? to : [to];
        
        // Find all recipients
        const receivers = await User.find({ email: { $in: recipientEmails } });
        
        if (receivers.length !== recipientEmails.length)
            return res.status(404).json({ message: 'One or more recipients not found' });

        const receiverIds = receivers.map(receiver => receiver._id);
        const trackingId = crypto.randomBytes(16).toString('hex');
        const threadId = crypto.randomBytes(16).toString('hex'); // New thread for forwarded email

        // Create forwarded email
        const forwardedEmail = await Email.create({
            to: recipientEmails,
            subject: `Fwd: ${originalEmail.subject}`,
            message: message || `---------- Forwarded message ----------\nFrom: ${originalEmail.senderId.fullname} <${originalEmail.senderId.email}>\nDate: ${originalEmail.createdAt}\nSubject: ${originalEmail.subject}\nTo: ${originalEmail.receiverIds.map(r => r.fullname).join(', ')}\n\n${originalEmail.message}`,
            senderId: userId,
            receiverIds,
            status: 'sent',
            trackingId,
            threadId,
            isReply: false,
            parentEmailId: originalEmail._id
        });

        // Update sender's sent box and each receiver's inbox
        await User.findByIdAndUpdate(userId, { $push: { sent: forwardedEmail._id } });
        for (const receiverId of receiverIds) {
            await User.findByIdAndUpdate(receiverId, { $push: { inbox: forwardedEmail._id } });
        }

        // Populate the forwarded email with all necessary data
        const populatedForward = await Email.findById(forwardedEmail._id)
            .populate('senderId', 'fullname email')
            .populate('receiverIds', 'fullname email')
            .populate({
                path: 'parentEmailId',
                populate: [
                    { path: 'senderId', select: 'fullname email' },
                    { path: 'receiverIds', select: 'fullname email' }
                ]
            });

        return res.status(201).json({ 
            message: 'Email forwarded successfully',
            email: populatedForward
        });

    } catch (error) {
        console.log('Error in forwardEmail:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Star an email
export const starEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        // Find the email and check if user has access to it
        const email = await Email.findOne({
            _id: id,
            $or: [
                { senderId: userId },
                { receiverIds: userId }
            ]
        });

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Add email to user's starred list
        await User.findByIdAndUpdate(userId, { $addToSet: { starred: id } });

        res.status(200).json({ message: 'Email starred successfully' });
    } catch (error) {
        console.log("error from starEmail=>", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Unstar an email
export const unstarEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        // Find the email and check if user has access to it
        const email = await Email.findOne({
            _id: id,
            $or: [
                { senderId: userId },
                { receiverIds: userId }
            ]
        });

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Remove email from user's starred list
        await User.findByIdAndUpdate(userId, { $pull: { starred: id } });

        res.status(200).json({ message: 'Email unstarred successfully' });
    } catch (error) {
        console.log("error from unstarEmail=>", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get starred emails
export const getStarredEmails = async (req, res) => {
    try {
        const userId = req.id;

        // Get user with populated starred emails
        const user = await User.findById(userId)
            .populate({
                path: 'starred',
                populate: [
                    { path: 'senderId', select: 'fullname email' },
                    { path: 'receiverIds', select: 'fullname email' }
                ],
                options: { sort: { createdAt: -1 } }
            });

        res.status(200).json({ emails: user.starred });
    } catch (error) {
        console.log("error from getStarredEmails=>", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new endpoint to get single email by ID
export const getEmailById = async (req, res) => {
    try {
        const { id } = req.params;
        const email = await Email.findById(id)
            .populate('senderId', 'fullname email')
            .populate('receiverIds', 'fullname email');

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        return res.status(200).json({ email });
    } catch (error) {
        console.error('Error in getEmailById:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Find the system user (welcome@primemail.com)
    const systemUser = await User.findOne({ email: 'welcome@primemail.com' });
    if (!systemUser) {
      throw new Error('System user not found');
    }

    // Find the new user
    const newUser = await User.findOne({ email: userEmail });
    if (!newUser) {
      throw new Error('New user not found');
    }

    const welcomeEmail = {
      subject: "Welcome to PrimeMail!",
      message: `Dear ${userName},\n\nWelcome to PrimeMail! We're thrilled to have you join our community.\n\nAs the developer behind PrimeMail, I'm incredibly excited to share this platform with you. This project is very close to my heart and an important part of my learning journey — and I'd truly love to hear what you think!\n\n💬 Please feel free to send your feedback, suggestions, or even just some good wishes to me at:  \n📧 **support@primemail.com**\n\nYour thoughts won't just help improve PrimeMail — they'll mean a lot to me personally as I grow as a developer.\n\nThank you for being a part of this journey.\n\nBest regards,  \n**Naresh Mahiya**`,
      to: userEmail
    };

    // Generate trackingId and threadId
    const trackingId = crypto.randomBytes(16).toString('hex');
    const threadId = crypto.randomBytes(16).toString('hex');

    // Create the welcome email
    const email = await Email.create({
      subject: welcomeEmail.subject,
      message: welcomeEmail.message,
      senderId: systemUser._id,
      receiverIds: [newUser._id],
      threadId,
      trackingId,
      status: 'sent',
      isReply: false
    });

    // Add the email to the user's inbox
    await User.findByIdAndUpdate(newUser._id, { $push: { inbox: email._id } });
    
    // Add the email to system user's sent box
    await User.findByIdAndUpdate(systemUser._id, { $push: { sent: email._id } });

    return email;
  } catch (error) {
    console.log("error from sendWelcomeEmail=>", error);
    throw error;
  }
};