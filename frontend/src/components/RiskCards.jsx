import React from 'react';

const RiskCards = ({ risks = [] }) => {
  if (risks.length === 0) return null;

  const severityColors = {
    'high': { bg: '#450a0a', text: '#fca5a5', border: '#7f1d1d' },
    'medium': { bg: '#422006', text: '#fcd34d', border: '#78350f' },
    'low': { bg: '#1e3a8a', text: '#93c5fd', border: '#1e40af' }
  };

  const getSeverityStyle = (severity) => severityColors[severity] || severityColors['low'];

  return (
    <div style={{ marginBottom: '4rem' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg style={{ width: '24px', height: '24px', color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Risky Clauses Detected
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {risks.map((risk, idx) => {
          const style = getSeverityStyle(risk.severity);
          return (
            <div key={idx} className="clean-card" style={{ padding: '1.5rem', borderTop: `4px solid ${style.text}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ 
                  background: style.bg, color: style.text, padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' 
                }}>
                  {risk.severity} Risk
                </span>
                <span className="text-subtle" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase' }}>
                  {risk.type}
                </span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Original Excerpt</div>
                <div style={{ 
                  background: 'var(--bg-color)', padding: '1rem', borderRadius: '6px',
                  color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5',
                  border: '1px solid var(--border-color)'
                }}>
                  "{risk.original}..."
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI Explanation</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {risk.simplified}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskCards;
