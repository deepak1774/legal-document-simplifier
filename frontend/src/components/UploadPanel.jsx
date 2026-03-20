import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadPanel = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    if(acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div className="clean-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', textAlign: 'center' }}>
      <div 
        {...getRootProps()} 
        style={{
          padding: '3rem 2rem',
          border: `2px dashed ${isDragActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          background: isDragActive ? 'rgba(37, 99, 235, 0.05)' : '#fafafa',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          transition: 'all 0.2s'
        }}
      >
        <input {...getInputProps()} />
        <svg style={{ width: '48px', height: '48px', color: 'var(--text-secondary)', margin: '0 auto 1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
          {isDragActive ? 'Drop your PDF here' : 'Drag & drop a PDF here, or click to browse'}
        </p>
        <p className="text-subtle" style={{ fontSize: '0.9rem' }}>
          Secure, private, in-memory processing.
        </p>
        
        {file && (
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span style={{ fontWeight: '500' }}>{file.name}</span>
          </div>
        )}
      </div>

      <button 
        onClick={() => onUpload && onUpload(file)}
        disabled={!file}
        className="primary-button"
        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
      >
        Simplify Document
      </button>
    </div>
  );
};

export default UploadPanel;
