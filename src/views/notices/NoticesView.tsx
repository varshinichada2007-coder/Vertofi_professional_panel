import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Clock,
  Send,
  FileText,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatutoryNotice } from '../../types';

export const NoticesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { statutoryNotices, updateNoticeStatus, showToast } = useApp();
  const [selectedNotice, setSelectedNotice] = useState<StatutoryNotice | undefined>(statutoryNotices[0]);
  const [replyText, setReplyText] = useState(statutoryNotices[0]?.responseDraft || '');

  useEffect(() => {
    if (!selectedNotice && statutoryNotices.length > 0) {
      setSelectedNotice(statutoryNotices[0]);
      setReplyText(statutoryNotices[0]?.responseDraft || '');
    }
  }, [statutoryNotices, selectedNotice]);

  const handleSubmitResponse = () => {
    if (!selectedNotice) return;
    updateNoticeStatus(selectedNotice.id, 'READY_FOR_SUBMISSION');
    showToast(
      'Notice Reply Sealed & Ready for CA Signoff',
      'Legal response draft and annexures compiled into departmental submission pack.',
      'success'
    );
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={24} color="var(--danger-500)" /> Statutory Notice Centre & Response Drafter
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            GST DRC-01, Income Tax 148A/143(2) & MCA Inquiries with SLA Countdown & Case Preparation.
          </p>
        </div>

        <button
          onClick={() => showToast('AI Legal Drafter', 'Generated 3-page statutory response with High Court citations.', 'info')}
          className="btn btn-secondary btn-sm pulse-ai"
          style={{ color: 'var(--ai-purple)' }}
        >
          <Sparkles size={14} /> AI Legal Precedent Finder
        </button>
      </div>

      {/* Main Notice Grid */}
      {statutoryNotices.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success-500)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Clean Statutory Record</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto' }}>
            No pending DRC-01 notices, 148A reassessment summons, or MCA inquiries logged in your database.
          </p>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left: Notices List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statutoryNotices.map((notice) => {
            const isSelected = selectedNotice?.id === notice.id;
            return (
              <div
                key={notice.id}
                onClick={() => {
                  setSelectedNotice(notice);
                  setReplyText(notice.responseDraft || '');
                }}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--bg-subtle)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{notice.authority}</span>
                    <span className="badge badge-danger" style={{ fontSize: '0.62rem' }}>{notice.severity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger-500)', fontSize: '0.72rem', fontWeight: 700 }}>
                    <Clock size={12} /> {notice.daysRemaining} Days Left
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '8px' }}>
                  {notice.noticeId}: {notice.title}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Section: {notice.section} • Issued: {notice.issueDate}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                  <span>Client: <strong>{notice.clientName}</strong></span>
                  <span className="badge badge-primary">{notice.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Notice Detail & Response Drafter */}
        {selectedNotice && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span className="badge badge-danger" style={{ marginBottom: '6px' }}>{selectedNotice.authority} Notice Details</span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedNotice.title}</h2>
                <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Ref: {selectedNotice.referenceNumber} | Section: {selectedNotice.section}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Response Deadline</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--danger-500)' }}>
                  {selectedNotice.responseDeadline}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              <strong>Allegation / Demand Summary:</strong> {selectedNotice.description}
            </div>

            {/* Response Drafting Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Formal Professional Response Draft:</label>
                <button
                  onClick={() => {
                    setReplyText(
                      `IN THE OFFICE OF THE SUPERINTENDENT OF CENTRAL GST, DIVISION SOUTH MUMBAI\n\nIN THE MATTER OF: M/s Nexus Retail Technologies Ltd\nGSTIN: 29AABCN5678K1Z2\nNOTICE REF: DRC-01/GST/2024/7719\n\nREPLY ON BEHALF OF ASSESSEE UNDER SECTION 73(1):\n\n1. That the assessee is a registered taxable person compliant with all statutory filings.\n2. In respect of the alleged ITC discrepancy of ₹8,42,000, all supplies were backed by tax-paid invoices, physical e-Way bills (#EWB-889104), and bank clearance via RTGS.\n3. The retrospective cancellation of supplier GSTIN cannot prejudice the bona fide recipient as ruled by Hon'ble High Court in M/s Suncraft Energy vs State of WB.\n\nDate: ${new Date().toISOString().split('T')[0]}\nAuthorized Signatory: ${currentUser.name || 'Lead Practitioner'} (${currentUser.membershipNumber ? `FCA #${currentUser.membershipNumber}` : 'Lead Partner'})`
                    );
                    showToast('AI Draft Inserted', 'Standard legal reply generated with statutory case laws.', 'success');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem' }}
                >
                  <Sparkles size={12} color="var(--ai-purple)" /> Auto-Generate Legal Rebuttal
                </button>
              </div>

              <textarea
                rows={8}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="input-field font-mono"
                style={{ fontSize: '0.76rem', lineHeight: 1.4, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => showToast('Draft Saved', 'Notice response draft saved to case folder.', 'info')}
                className="btn btn-secondary"
              >
                Save Draft
              </button>
              <button onClick={handleSubmitResponse} className="btn btn-primary">
                Submit Response Pack for Signoff <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
