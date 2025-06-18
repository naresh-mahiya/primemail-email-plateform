import React, { useState } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import api from '../api';

const AIReplyAssistant = ({ originalMessage, onInsert}) => {
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');

  const handleGenerateReply = async () => {
    if (!originalMessage) {
      toast.warn('Original message is missing');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/ai/smart-reply', { originalMessage }, { withCredentials: true });
      setGeneratedReply(response.data.reply);
      toast.success('AI reply generated!');
    } catch (error) {
      console.error('Error generating smart reply:', error);
      toast.error('Failed to generate smart reply');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedReply) {
      onInsert(generatedReply);
      toast.info('Inserted AI reply into composer');
    }
  };

  return (
    <div className={"p-4 border rounded-lg shadow-sm bg-white "}>
      <button
        type="button"
        onClick={handleGenerateReply}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
      >
        <RiRobot2Line className={loading ? 'animate-pulse' : ''} />
        {loading ? 'Thinking...' : 'AI smart reply'}
      </button>

      {generatedReply && (
        <div className="mt-3">
          <h4 className="font-semibold mb-1">AI Suggested Reply:</h4>
          <div className="p-2 border rounded bg-gray-100 whitespace-pre-wrap text-sm">{generatedReply}</div>
          <button
            onClick={handleInsert}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Insert
          </button>
        </div>
      )}
    </div>
  );
};

export default AIReplyAssistant;
