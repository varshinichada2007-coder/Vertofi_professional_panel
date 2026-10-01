import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  FileText,
  Building,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Calendar,
  Share2,
  Users,
  LayoutGrid,
  List,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  Shield,
  FileCheck,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const DashboardView: React.FC = () => {
  const {
    currentClient,
    clients,
    tasks,
    approvals,
    riskExceptions,
    statutoryNotices,
    auditLogs,
    setActiveView,
    updateTaskStatus,
    showToast
  } = useApp();

  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LISTS' | 'BOARD' | 'CALENDAR' | 'ASSIGNED'>('OVERVIEW');

  // Real data calculations
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressCount = tasks.filter((t) => t.status === 'PENDING_REVIEW' || t.status === 'PENDING_APPROVAL').length;
  const createdCount = tasks.length;
  const dueSoonCount = tasks.filter((t) => t.status === 'DUE_TODAY' || t.status === 'UPCOMING').length;

  const highPriorityCount = tasks.filter((t) => t.priority === 'HIGH' || t.priority === 'CRITICAL').length;
  const mediumPriorityCount = tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'LOW').length;

  const totalTasks = tasks.length || 1;
  const todoPercentage = tasks.length ? Math.round((dueSoonCount / totalTasks) * 100) : 0;
  const inProgressPercentage = tasks.length ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const donePercentage = tasks.length ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 1. Page Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              My Workbench
            </h1>
            <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
              <ShieldCheck size={13} /> {currentUser.name || 'Verified Practitioner'} ({currentUser.role})
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              Entity: {currentClient?.name || 'No Entity Selected'}
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Statutory financial operations and executive review workspace
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              showToast('Link Copied', 'Workbench summary link copied to clipboard.', 'info');
            }}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '8px', padding: '8px 14px', background: '#FFFFFF' }}
          >
            <Share2 size={14} /> Share Tasks
          </button>
          <button
            onClick={() => setActiveView('accounting')}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: 700 }}
          >
            <Plus size={15} /> + New Task / Journal
          </button>
        </div>
      </div>

      {/* 2. Top Nav View Tabs (Overview, Lists, Board, Calendar, Assigned to me) */}
      <div className="view-tabs" style={{ background: '#FFFFFF', padding: '6px 10px', borderRadius: '12px', border: '1px solid #E8ECF2' }}>
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`view-tab-btn ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
        >
          <CheckSquare size={14} /> Overview
        </button>
        <button
          onClick={() => {
            setActiveTab('LISTS');
            setActiveView('tasks');
          }}
          className={`view-tab-btn ${activeTab === 'LISTS' ? 'active' : ''}`}
        >
          <List size={14} /> Lists
        </button>
        <button
          onClick={() => {
            setActiveTab('BOARD');
            setActiveView('tasks');
          }}
          className={`view-tab-btn ${activeTab === 'BOARD' ? 'active' : ''}`}
        >
          <LayoutGrid size={14} /> Board
        </button>
        <button
          onClick={() => {
            setActiveTab('CALENDAR');
            setActiveView('tax');
          }}
          className={`view-tab-btn ${activeTab === 'CALENDAR' ? 'active' : ''}`}
        >
          <Calendar size={14} /> Calendar
        </button>
        <button
          onClick={() => {
            setActiveTab('ASSIGNED');
            setActiveView('tasks');
          }}
          className={`view-tab-btn ${activeTab === 'ASSIGNED' ? 'active' : ''}`}
        >
          <Users size={14} /> Task assigned to me
        </button>
      </div>

      {/* 3. Four Pastel Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {/* Card 1: Completed */}
        <div
          style={{
            background: '#F6F3FF',
            border: '1px solid #EADEFF',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ECE6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCheck size={15} color="#7C3AED" />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E1B4B' }}>Completed</span>
            </div>
            <MoreVertical size={15} color="#94A3B8" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>{completedCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#7C3AED', fontWeight: 700 }}>
              <TrendingUp size={13} /> {tasks.length ? `${donePercentage}%` : '0%'}
              <span style={{ color: '#64748B', fontWeight: 500 }}>of total tasks</span>
            </div>
          </div>
        </div>

        {/* Card 2: In Progress / Review */}
        <div
          style={{
            background: '#FAF0F7',
            border: '1px solid #F6DCEF',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F5E1F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={15} color="#C026D3" />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#4A044E' }}>In Progress / Review</span>
            </div>
            <MoreVertical size={15} color="#94A3B8" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>{inProgressCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#C026D3', fontWeight: 700 }}>
              <TrendingUp size={13} /> {tasks.length ? `${inProgressPercentage}%` : '0%'}
              <span style={{ color: '#64748B', fontWeight: 500 }}>under active triage</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Tasks Created */}
        <div
          style={{
            background: '#F0FAF8',
            border: '1px solid #D5F1EB',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#D8F3ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={15} color="#0D9488" />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#042F2E' }}>Total Tasks</span>
            </div>
            <MoreVertical size={15} color="#94A3B8" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>{createdCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#0D9488', fontWeight: 700 }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Live items in database</span>
            </div>
          </div>
        </div>

        {/* Card 4: Due Soon */}
        <div
          style={{
            background: '#FFF7ED',
            border: '1px solid #FFEDD5',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FFE8D2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={15} color="#EA580C" />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#431407' }}>Due Soon / Today</span>
            </div>
            <MoreVertical size={15} color="#94A3B8" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>{dueSoonCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#EA580C', fontWeight: 700 }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Immediate deadlines</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Priority Breakdown + Status Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left: Priority Breakdown Multi-Line Spline Chart */}
        <div className="saas-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Priority Breakdown
            </h3>
            <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          {/* Legend Strip with 3 Priorities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1' }} />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>{highPriorityCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>High Priority</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>{mediumPriorityCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Medium Priority</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>{lowPriorityCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Low Priority</div>
              </div>
            </div>
          </div>

          {/* SVG Multi-Line Chart or Empty State */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            {tasks.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', gap: '10px' }}>
                <Clock size={32} strokeWidth={1.5} color="var(--text-muted)" />
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>No task priority records logged yet</span>
                <button onClick={() => setActiveView('tasks')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.74rem' }}>
                  + Create First Task
                </button>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="700" y2="90" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="700" y2="180" stroke="#E2E8F0" />

                  <path
                    d="M 20 160 Q 80 155 140 145 T 260 70 T 380 90 T 500 50 T 620 40 T 680 30 L 680 180 L 20 180 Z"
                    fill="url(#purpleGradient)"
                  />
                  <path
                    d="M 20 160 Q 80 155 140 145 T 260 70 T 380 90 T 500 50 T 620 40 T 680 30"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94A3B8', marginTop: '8px' }}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Status Overview Circular Progress Rings */}
        <div className="saas-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Status overview
            </h3>
            <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Status 1: To Do */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E8ECF2',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#6366F1' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  To Do: <strong>{dueSoonCount} Work</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#6366F1' }}>{todoPercentage}%</span>
                <div style={{ width: '48px', height: '6px', background: '#EEF2FF', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${todoPercentage}%`, height: '100%', background: '#6366F1', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

            {/* Status 2: In Progress */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E8ECF2',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#A855F7' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  In Progress: <strong>{inProgressCount} Work</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#A855F7' }}>{inProgressPercentage}%</span>
                <div style={{ width: '48px', height: '6px', background: '#FAF5FF', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${inProgressPercentage}%`, height: '100%', background: '#A855F7', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

            {/* Status 3: Done */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E8ECF2',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#EA580C' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Done: <strong>{completedCount} Work</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#EA580C' }}>{donePercentage}%</span>
                <div style={{ width: '48px', height: '6px', background: '#FFF7ED', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${donePercentage}%`, height: '100%', background: '#EA580C', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        {/* Card 1: Practice Status */}
        <div className="saas-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Practice Health & Active Entities
            </span>
            <MoreVertical size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {clients.length} Active {clients.length === 1 ? 'Client' : 'Clients'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
              {tasks.length} total tasks
            </span>
          </div>

          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E8ECF2', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div>Entity in focus: <strong style={{ color: 'var(--text-primary)' }}>{currentClient?.name || 'None selected'}</strong></div>
            <div style={{ marginTop: '4px' }}>Pending Approvals: <strong style={{ color: 'var(--text-primary)' }}>{approvals.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length}</strong></div>
            <div style={{ marginTop: '4px' }}>Statutory Notices: <strong style={{ color: 'var(--text-primary)' }}>{statutoryNotices.length}</strong></div>
          </div>
        </div>

        {/* Card 2: Task completed by assignee (Donut Chart) */}
        <div className="saas-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Task Assignment & Lead
            </span>
            <MoreVertical size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#6366F1"
                strokeWidth="12"
                strokeDasharray={`${tasks.length ? Math.min(100, Math.round((completedCount / (tasks.length || 1)) * 238)) : 0} 238`}
                strokeDashoffset="0"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {tasks.length ? `${donePercentage}%` : '0%'}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Completed<br/>Rate</div>
            </div>
          </div>

          {/* Lead badge */}
          <div style={{ marginTop: '12px', fontSize: '0.74rem', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1' }} />
              {currentUser.name || 'Practicing Lead'} ({currentUser.role})
            </span>
          </div>
        </div>

        {/* Card 3: Recent Activity */}
        <div className="saas-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Recent activity
            </span>
            <MoreVertical size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                No recent activity logged yet. All actions you perform will appear in real time here.
              </div>
            ) : (
              auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E8ECF2' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {log.action} • {log.module}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6366F1', marginTop: '2px' }}>
                    • {log.newValue || log.resource}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {log.timestamp} • {log.userName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
