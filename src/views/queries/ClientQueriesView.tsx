import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  User,
  Search,
  Filter,
  Paperclip,
  Check,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Bell,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientQuery, QueryReply } from '../../types';

export const ClientQueriesView: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    clientQueries,
    addClientQueryReply,
    resolveClientQuery,
    simulateIncomingClientQuery,
    clients,
    showToast
  } = useApp();

  const [selectedQueryId, setSelectedQueryId] = useState<string>(clientQueries[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedQuery = clientQueries.find((q) => q.id === selectedQueryId) || clientQueries[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedQuery) return;

    addClientQueryReply(selectedQuery.id, replyText, currentUser.role as any);
    setReplyText('');
  };

  const handleSimulateNewQuery = () => {
    simulateIncomingClientQuery();
  };

  const filteredQueries = clientQueries.filter((q) => {
    const matchesSearch =
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || q.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)',
          border: '1px solid #E0E7FF',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MessageSquare size={22} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Client Queries & Communications
              </h1>
              <span className="badge badge-primary font-mono" style={{ fontSize: '0.7rem' }}>
                CA ID: {currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Direct message bridge with the Vertofi Business Portal — notifications dispatch instantly on client questions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSimulateNewQuery}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Simulate client asking a question from Business Portal to test CA notification"
          >
            <Bell size={14} /> + Simulate Incoming Client Message
          </button>
        </div>
      </div>

      {/* Main Grid: Query List & Active Conversation */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px', minHeight: '620px' }}>
        {/* Left Column: Query Inbox */}
        <div
          className="glass-panel"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Filters Bar */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search queries or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '32px', height: '34px', fontSize: '0.78rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.74rem', height: '30px', padding: '0 8px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.74rem', height: '30px', padding: '0 8px' }}
              >
                <option value="ALL">All Categories</option>
                <option value="GST_QUERY">GST Query</option>
                <option value="TDS_MISMATCH">TDS & Direct Tax</option>
                <option value="TAX_CLARIFICATION">Tax Notice DRC-01</option>
              </select>
            </div>
          </div>

          {/* Query Items List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredQueries.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No client queries matching the selected filter.
              </div>
            ) : (
              filteredQueries.map((q) => {
                const isSelected = selectedQuery?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQueryId(q.id)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--primary-600)' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 6px', background: q.priority === 'CRITICAL' ? '#FEF2F2' : '#EEF2FF', color: q.priority === 'CRITICAL' ? '#DC2626' : '#4F46E5' }}>
                        {q.category.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{q.createdAt}</span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {q.subject}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building size={12} color="var(--text-muted)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {q.clientName}
                        </span>
                      </div>

                      <span className={`badge badge-${q.status === 'RESOLVED' ? 'success' : q.status === 'IN_PROGRESS' ? 'warning' : 'primary'}`} style={{ fontSize: '0.65rem' }}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Query Thread */}
        {selectedQuery ? (
          <div
            className="glass-panel"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Thread Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                background: 'var(--bg-app)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-primary">{selectedQuery.category}</span>
                  <span className={`badge badge-${selectedQuery.status === 'RESOLVED' ? 'success' : 'warning'}`}>
                    {selectedQuery.status}
                  </span>
                  <span className="badge badge-neutral font-mono" style={{ fontSize: '0.7rem' }}>
                    Routed to CA ID: {selectedQuery.caIdNumber}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '4px' }}>
                  {selectedQuery.subject}
                </h2>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>From: <strong style={{ color: 'var(--text-primary)' }}>{selectedQuery.senderName}</strong> ({selectedQuery.senderRole})</span>
                  <span>•</span>
                  <span>{selectedQuery.clientName}</span>
                  <span>•</span>
                  <span>{selectedQuery.createdAt}</span>
                </div>
              </div>

              {selectedQuery.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolveClientQuery(selectedQuery.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A' }}
                >
                  <CheckCircle2 size={15} /> Mark Resolved
                </button>
              )}
            </div>

            {/* Conversation Flow */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Initial Client Message */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  alignSelf: 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#EEF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      color: '#4F46E5'
                    }}
                  >
                    {selectedQuery.senderName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {selectedQuery.senderName}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {selectedQuery.senderRole} • {selectedQuery.createdAt}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {selectedQuery.message}
                </p>
              </div>

              {/* Replies */}
              {selectedQuery.replies.map((rep: QueryReply) => {
                const isCaSender = rep.senderRole === 'CA';
                return (
                  <div
                    key={rep.id}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      background: isCaSender ? '#EEF2FF' : '#F8FAFC',
                      border: isCaSender ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
                      alignSelf: isCaSender ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isCaSender ? '#6366F1' : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}
                      >
                        {rep.senderName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {rep.senderName} {isCaSender && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Assigned CA</span>}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {rep.timestamp}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: isCaSender ? '#1E1B4B' : 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {rep.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form
              onSubmit={handleSendReply}
              style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-app)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                placeholder="Type your professional reply or instructions for the client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="input-field"
                style={{ flex: 1, height: '42px', fontSize: '0.82rem' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '42px', padding: '0 18px' }}
              >
                <Send size={15} /> Send Reply
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a query from the inbox to view thread
          </div>
        )}
      </div>
    </div>
  );
};
