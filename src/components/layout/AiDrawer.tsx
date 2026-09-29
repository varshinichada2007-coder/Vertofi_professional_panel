import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  FileSearch,
  Scale,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CornerDownLeft,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  evidence?: { title: string; type: string; linkText: string; viewTarget?: string };
  suggestedActions?: string[];
}

export const AiDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, currentClient, setActiveView, showToast } = useApp();
  const { currentUser } = useAuth();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${currentUser.name.split(' ')[0]}. I am your **Vertofi Financial Intelligence Copilot** for **${currentClient.name}**.\n\nI can analyze general ledgers, explain GSTR-2B vs 3B discrepancies, draft statutory notice replies, and pinpoint duplicate vendor risks. All findings provide auditable source citations.`,
      timestamp: 'Just now',
      suggestedActions: [
        'Summarize Q3 Tax & ITC Position',
        'Analyze DRC-01 GST Notice Risk',
        'Check Unreconciled Bank Feeds',
        'Draft Section 194J TDS Justification'
      ]
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // AI Response Simulation with explainable rationale & exact evidence sources
    setTimeout(() => {
      let aiText = '';
      let evidenceObj: Message['evidence'] | undefined = undefined;

      const q = query.toLowerCase();
      if (q.includes('tax') || q.includes('itc') || q.includes('gst')) {
        aiText = `### Tax & ITC Synthesis for ${currentClient.name}:\n\n- **GSTR-3B Liability**: Total output liability is **₹34,20,000**.\n- **ITC Available (GSTR-2B)**: **₹21,80,000**.\n- **Net Tax Due in Cash**: **₹12,40,000**.\n- **Discrepancy / Exception**: Found **₹12,480** ITC from vendor *CloudNet Services* whose GSTIN was retroactively cancelled. Recommend reversing this in Table 4(B)(2) to prevent statutory interest under Sec 50.\n\n*Note: Professional validation is required before filing.*`;
        evidenceObj = {
          title: 'GSTR-2B Matched Records & Cancellation Order #ZD290824001',
          type: 'GST_RETURN',
          linkText: 'View Tax Workspace',
          viewTarget: 'tax'
        };
      } else if (q.includes('notice') || q.includes('drc-01')) {
        aiText = `### Statutory Notice DRC-01 Legal Assessment:\n\n- **Authority**: CGST Mumbai South Commissionerate\n- **Subject**: Alleged Section 73 ITC difference of **₹8,42,000** for FY 2023-24.\n- **Audit Lineage**: All invoices contain genuine e-Way bills and bank clearance logs via HDFC A/c 8891.\n- **Draft Prepared**: 3-page legal rebuttal prepared citing Karnataka HC precedent *M/s Suncraft Energy* (burden of supplier filing).\n\nShall I transfer this draft into the Notice Centre for CA signoff?`;
        evidenceObj = {
          title: 'Notice DRC-01 & Annexure B Rebuttal Draft',
          type: 'STATUTORY_NOTICE',
          linkText: 'Open Notice Centre',
          viewTarget: 'notices'
        };
      } else if (q.includes('bank') || q.includes('reconcil')) {
        aiText = `### Bank Feed Intelligence Summary:\n\n- **Reconciliation Rate**: **94.2%**\n- **Unmatched Entries**: 4 items totalling ₹5,14,200.\n- **Key Item**: ₹4,89,200 Razorpay settlement batch with 42 bundled micropayments. Ready for automated 1-click batch allocation.\n- **Exception**: ₹25,000 cheque dishonor charge needing reclassification to Account 5003.`;
        evidenceObj = {
          title: 'HDFC Corporate Feed Sync #BTX-OCT18',
          type: 'BANK_FEED',
          linkText: 'Open Bank Reconciliation',
          viewTarget: 'reconciliation'
        };
      } else {
        aiText = `### Financial Analysis for ${currentClient.name}:\n\n- **Annual Turnover**: ₹4.28 Cr (FY 2024-25)\n- **Business Health Score (BHS)**: **${currentClient.bhsScore}/100** (Grade A+)\n- **Open Exceptions**: 1 low-risk TDS rate classification item.\n- **Pending Approvals**: 2 Journal Vouchers in Maker-Checker queue.\n\nAll figures verified against General Ledger as of today.`;
        evidenceObj = {
          title: 'Client Financial Health & General Ledger Snapshot',
          type: 'CLIENT_360',
          linkText: 'View Client 360',
          viewTarget: 'client-360'
        };
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: evidenceObj
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAiDrawerOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #EEF2FF 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Vertofi AI Assistant
                <span className="badge badge-ai" style={{ fontSize: '0.6rem' }}>Explainable</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Active Client Context: <strong style={{ color: 'var(--text-primary)' }}>{currentClient.name}</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Disclaimer Pill */}
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(99,102,241,0.08)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} color="var(--primary-500)" style={{ flexShrink: 0 }} />
          <span>AI output assists financial professionals but does not replace regulated professional judgment.</span>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '90%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary-600)' : 'var(--bg-card)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                {/* Evidence Source Box */}
                {msg.evidence && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-500)', fontWeight: 700 }}>
                      <FileSearch size={14} /> Auditable Source Evidence:
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                      {msg.evidence.title}
                    </div>
                    {msg.evidence.viewTarget && (
                      <button
                        onClick={() => {
                          if (msg.evidence?.viewTarget) setActiveView(msg.evidence.viewTarget as any);
                          setIsAiDrawerOpen(false);
                        }}
                        style={{
                          marginTop: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--info-500)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {msg.evidence.linkText} <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                )}

                {/* Suggested prompt chips */}
                {msg.suggestedActions && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Suggested Inquiries:
                    </div>
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        style={{
                          textAlign: 'left',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="glass-panel-hover"
                      >
                        → {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                {msg.timestamp}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', color: 'var(--ai-purple)', fontSize: '0.78rem' }}>
              <Sparkles size={14} className="pulse-ai" /> Analyzing verified ledger & statutory returns...
            </div>
          )}
        </div>

        {/* Prompt Input Box */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder={`Ask AI about ${currentClient.name.split(' ')[0]}'s financials, tax, or notices...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="input-field"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
              <Send size={16} />
            </button>
          </form>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
            Press Enter to query authorized entity dataset.
          </div>
        </div>
      </div>
    </div>
  );
};
