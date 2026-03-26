import React from 'react';

const ScanAnimation = ({ progress = 0 }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 5, 5, 0.9)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="clean-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <svg style={{ width: '48px', height: '48px', color: 'var(--accent-primary)', margin: '0 auto 1.5rem', animation: 'spin 2s linear infinite' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </svg>
        
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>AI Analyzing Document...</h3>
        
        <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
        </div>
        <p className="text-subtle" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          Simplifying legal text and summarizing key points. This takes approximately ~20 seconds.
        </p>
      </div>
    </div>
  );
};

export default ScanAnimation;
