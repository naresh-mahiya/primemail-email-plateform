import React, { useState } from 'react';
import api from '../api'


const AICompose = ({ onClose, onInsert }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const askAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(
        'api/v1/ai/compose',
        { prompt },
        { withCredentials: true }
      );
      setResult(data.text);
    } catch (err) {
      console.error('AI compose error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e293b] text-white rounded-xl shadow-2xl p-4 w-96 border border-gray-600">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">✨ AI Compose</h2>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition"
          title="Close"
        >
          ✕
        </button>
      </div>

      <textarea
        className="w-full p-2 rounded bg-[#334155] border border-gray-500 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        placeholder="Describe what you want the email to say..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-2 mt-3">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition"
          onClick={askAI}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Ask AI'}
        </button>
        <button
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {result && (
        <div className="bg-[#475569] p-2 rounded mt-3 border border-gray-500">
          <p className="whitespace-pre-line text-sm">{result}</p>
          <button
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded transition"
            onClick={() => onInsert(result)}
          >
            Insert into Email
          </button>
        </div>
      )}
    </div>
  );
};

export default AICompose;
