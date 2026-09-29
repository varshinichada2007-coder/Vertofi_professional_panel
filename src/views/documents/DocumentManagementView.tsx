import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  Send,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';

export const DocumentManagementView: React.FC = () => {
  const { documents, uploadDocument, currentClient, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'GST', 'INCOME_TAX', 'MCA', 'INVOICES', 'BANK', 'FINANCIAL_STATEMENTS', 'LEGAL'];

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
    return true;
  });

  const handleSimulateUpload = () => {
    uploadDocument({
      title: 'Board Meeting Resolution - Share Allotment PAS-3',
      category: 'MCA',
      fileName: 'Board_Res_Allotment_2024.pdf'
    });
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderLock size={24} color="var(--primary-500)" /> Document Management & Virtual Data Room (VDR)
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            OCR-Indexed Statutory Archives, Document Requests, Version Control & Evidence Vault.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => showToast('Document Request Sent', 'Notified client director to upload FIRC certificates.', 'info')}
            className="btn btn-secondary btn-sm"
          >
            <Send size={14} /> Request Client Document
          </button>
          <button onClick={handleSimulateUpload} className="btn btn-primary btn-sm">
            <Upload size={14} /> Upload & OCR Process
          </button>
        </div>
      </div>

      {/* Category Folders */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{ fontSize: '0.72rem', padding: '4px 12px' }}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>File Size & Type</th>
              <th>Uploaded By</th>
              <th>OCR Confidence</th>
              <th>Version</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="var(--primary-500)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{doc.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.fileName}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{doc.category}</span></td>
                <td>
                  <div>{doc.fileSize}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{doc.fileType}</div>
                </td>
                <td>
                  <div>{doc.uploadedBy}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{doc.uploadedAt}</div>
                </td>
                <td>
                  <span className="badge badge-ai" style={{ fontSize: '0.62rem' }}>
                    <Sparkles size={10} /> {doc.ocrConfidence}% OCR
                  </span>
                </td>
                <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>v{doc.version}.0</span></td>
                <td><span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{doc.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => showToast('Document Preview', `Opening ${doc.fileName} in secure sandbox.`, 'info')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => showToast('Document Download', `Downloading ${doc.fileName}`, 'success')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
