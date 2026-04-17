import React, { useState } from 'react';
import './Upload.css';

function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setMessage(`✓ ${result.message}`);
      setFile(null);
      document.getElementById('fileInput').value = '';
      
      // Call parent callback to refresh data
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload Data</h2>
      
      <form onSubmit={handleUpload}>
        <div className="file-input-wrapper">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            accept=".csv,.json,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
            disabled={uploading}
          />
          <label htmlFor="fileInput" className="file-label">
            {file ? file.name : 'Choose file...'}
          </label>
        </div>

        <div className="supported-formats">
          <p className="label">Supported formats:</p>
          <ul>
            <li>📊 CSV (HUMINT)</li>
            <li>📄 JSON (OSINT)</li>
            <li>📈 Excel (OSINT)</li>
            <li>🖼️ Images (IMINT)</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}

export default Upload;
