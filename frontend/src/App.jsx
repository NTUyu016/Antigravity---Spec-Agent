import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Copy, Terminal, FileText, Loader2, Key } from 'lucide-react';
import './App.css';

function App() {
  const [requirements, setRequirements] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/generate', {
        requirements,
        api_key: apiKey || null
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to generate spec. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Spec Kit Agent</h1>
        <p>Turn your natural language requirements into Spec-Driven Development artifacts.</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <h2>1. Input Requirements</h2>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your feature or application here... e.g., 'I want a todo app with categories and reminders'"
            rows={6}
          />

          <div className="api-key-section">
            <label className="api-key-label">
              <Key size={16} />
              <span>OpenAI API Key (Optional - for auto-generation)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
            />
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={!requirements || loading}
          >
            {loading ? <><Loader2 className="spin" size={20} /> Generating...</> : 'Generate Spec'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {result && (
          <div className="output-section">
            <div className="result-card">
              <div className="card-header">
                <h3><Terminal size={20} /> Spec Prompt</h3>
                <button onClick={() => copyToClipboard(result.prompt)} className="copy-btn">
                  <Copy size={16} /> Copy
                </button>
              </div>
              <div className="card-content prompt-content">
                <pre>{result.prompt}</pre>
              </div>
            </div>

            <div className="result-card">
              <div className="card-header">
                <h3><FileText size={20} /> Generated spec.md</h3>
                <button onClick={() => copyToClipboard(result.spec)} className="copy-btn">
                  <Copy size={16} /> Copy
                </button>
              </div>
              <div className="card-content spec-content">
                <ReactMarkdown>{result.spec}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
