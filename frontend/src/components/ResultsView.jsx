import React, { useState } from 'react';

const formatSimplified = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('──')) {
      return (
        <div key={i} style={{ fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', margin: i > 0 ? '1.5rem 0 0.75rem' : '0 0 0.75rem', borderTop: i > 0 ? '1px solid var(--border-color)' : 'none', paddingTop: i > 0 ? '1.25rem' : '0' }}>
          {line.replace(/─/g, '').trim()}
        </div>
      );
    }
    if (line.startsWith('•')) {
      const content = line.slice(1).trim();
      // Extract [Pg. N] badge if present
      const pgMatch = content.match(/^\[Pg\.\s*(\d+)\]\s*/);
      const pageNum = pgMatch ? pgMatch[1] : null;
      const text = pgMatch ? content.slice(pgMatch[0].length) : content;
      return (
        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>•</span>
          <span style={{ lineHeight: '1.6', color: 'var(--text-primary)', flex: 1 }}>
            {pageNum && (
              <span style={{ display: 'inline-block', background: '#eff6ff', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '700', padding: '0.1rem 0.45rem', borderRadius: '4px', marginRight: '0.5rem', border: '1px solid #bfdbfe', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                Pg. {pageNum}
              </span>
            )}
            {text}
          </span>
        </div>
      );
    }
    return line ? <p key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{line}</p> : null;
  });
};

const ResultsView = ({ originalText, simplifiedText }) => {
  const [splitView, setSplitView] = useState(true);

  return (
    <div style={{ margin: '0 auto', width: '100%', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          onClick={() => setSplitView(!splitView)}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {splitView ? 'Show Simplified Only' : 'Show Original Side-by-Side'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: splitView ? 'row' : 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {splitView && (
          <div className="clean-card" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: '600' }}>
              Original Document
            </h3>
            <div style={{ overflowY: 'auto', maxHeight: '600px', fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
              {originalText}
            </div>
          </div>
        )}

        <div className="clean-card" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-primary)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: '600' }}>
            Key Takeaways — Page by Page
          </h3>
          <div style={{ overflowY: 'auto', maxHeight: '600px', paddingRight: '0.25rem' }}>
            {formatSimplified(simplifiedText)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsView;
