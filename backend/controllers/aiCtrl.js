import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
 


// Load GEMINI API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set in environment variables. AI features will not work.');
}


export const composeEmailAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text: aiText });
  } catch (error) {
    console.error('Error in composeEmailAI:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to generate email' });
  }
};


export const summarizeEmailAI = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const prompt = `Summarize the following email in 2-3 sentences.\n\nSubject: ${subject}\n\nMessage: ${message}`;

    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 256,
      },
    });

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error in summarizeEmailAI:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to summarize email' });
  }
};


export const smartReplyAI = async (req, res) => {
  try {
    const { originalMessage } = req.body;
    if (!originalMessage) {
      return res.status(400).json({ message: 'Original message is required' });
    }

    const prompt = `Write a polite and appropriate reply to the following email:\n\n${originalMessage}`;

    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 512,
      },
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in smartReplyAI:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to generate smart reply' });
  }
};
