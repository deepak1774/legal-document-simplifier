import React from 'react';

const Footer = () => {
  const stacks = ['React', 'FastAPI', 'PyMuPDF', 'HuggingFace'];

  return (
    <footer style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid var(--border-color)', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>

        <div className="text-subtle" style={{ fontSize: '0.875rem', display: 'flex', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
