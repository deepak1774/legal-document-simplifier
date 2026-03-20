import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import Hero from './components/Hero';
import UploadPanel from './components/UploadPanel';
import ScanAnimation from './components/ScanAnimation';
import ResultsView from './components/ResultsView';
import RiskCards from './components/RiskCards';
import StatsBar from './components/StatsBar';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    setResults(null);
    
    const interval = setInterval(() => {
      setProgress(p => (p < 85 ? p + 5 : p));
    }, 200);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setResults(response.data);
        setUploading(false);
      }, 500);
    } catch (error) {
      console.error('Upload error', error);
      clearInterval(interval);
      setUploading(false);
      alert('Error analyzing document. Make sure backend is running.');
    }
  };

  return (
    <div className="app-container">
      {uploading && <ScanAnimation progress={progress} />}

      <main style={{ position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {!results && !uploading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
            <Hero />
            <UploadPanel onUpload={handleUpload} />
          </div>
        )}

        {results && !uploading && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Analysis Complete</h2>
              <button 
                onClick={() => setResults(null)}
                className="primary-button"
              >
                Analyze Another Document
              </button>
            </div>
            
            <StatsBar stats={results.stats} />
            <ResultsView 
              originalText={results.original_text} 
              simplifiedText={results.simplified_text} 
            />
            <RiskCards risks={results.risk_clauses} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
