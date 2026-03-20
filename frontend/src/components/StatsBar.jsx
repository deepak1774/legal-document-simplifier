import React from 'react';

const StatsBar = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'Pages Analyzed', value: stats.pages },
    { label: 'Clauses Found', value: stats.clauses_found },
    { label: 'Risks Flagged', value: stats.risk_items, color: '#ef4444' },
    { label: 'Time Saved (est)', value: stats.reading_time_saved }
  ];

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {statItems.map((item, idx) => (
          <div key={idx} className="clean-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <span className="text-subtle" style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              {item.label}
            </span>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: item.color || 'var(--text-primary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
