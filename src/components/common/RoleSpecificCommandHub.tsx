import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck,
  Calculator,
  PieChart,
  FileText,
  AlertTriangle,
  Building,
  CheckCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  Download,
  Upload,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const RoleSpecificCommandHub: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentClient, setActiveView, showToast, submitJournalEntry, approveItem } = useApp();

  // Role: CA
  const renderCaHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            CA Statutory Signoff & Direct Tax Command Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ICAI Audits, Form 3CD, Tax Computations, Journal Signoffs & Notice Submissions
          </p>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
          Lead Statutory Auditor (CA)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* CA Tool 1 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Direct Tax Form 3CD Review</span>
            <span className="badge badge-success">44 Clauses Cleared</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Tax Audit Working Paper & Depreciation Schedule
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Straight-line depreciation mapped to Companies Act Schedule II and Sec 32 IT Act.
          </div>
          <button
            onClick={() => {
              setActiveView('accounting');
              showToast('Form 3CD Schedule Opened', 'Depreciation & disallowance ledger loaded.', 'info');
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Review 3CD Working Papers →
          </button>
        </div>

        {/* CA Tool 2 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger-500)' }}>Statutory Notice DRC-01 Reply</span>
            <span className="badge badge-danger">18 Days Remaining</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            CGST Mumbai South Section 73 Defense Pack
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            High Court legal precedent draft ready with bank clearance vouchers for ₹8.42L ITC.
          </div>
          <button
            onClick={() => {
              setActiveView('notices');
              showToast('Notice DRC-01 Rebuttal', 'Loaded legal draft for CA digital signature.', 'info');
            }}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Sign & Seal Notice Reply →
          </button>
        </div>

        {/* CA Tool 3 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning-500)' }}>CARO 2020 Compliance</span>
            <span className="badge badge-warning">Clause 3(i) Verified</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Fixed Asset Physical Verification & Title Deeds
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Fixed asset register reconciled with ₹1.25 Cr ledger balance.
          </div>
          <button
            onClick={() => {
              setActiveView('audit');
              showToast('CARO 2020 Module', 'CARO physical verification log verified.', 'success');
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Verify CARO Checklist →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: CMA
  const renderCmaHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            CMA Cost Audit, Material Variance & ITC Optimization Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Cost Accounting Standards (CAS-1 to CAS-24), GSTR-2B Input Optimization & SKU Margins
          </p>
        </div>
        <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
          Cost & Management Consultant (CMA)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* CMA Tool 1 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>CAS-4 Cost Sheet Builder</span>
            <span className="badge badge-success">CAS-4 Verified</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Captive Consumption & Production Costing
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Direct Material (54%), Direct Labor (22%), Factory Overheads (14%), Quality Overheads (10%).
          </div>
          <button
            onClick={() => showToast('CAS-4 Generated', 'Computed cost of production with CAS-4 norms.', 'success')}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Calculate Unit Cost Breakdown →
          </button>
        </div>

        {/* CMA Tool 2 */}
        <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger-500)' }}>Section 17(5) Ineligible ITC Quarantine</span>
            <span className="badge badge-danger">₹12,480 Blocked</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#991B1B' }}>
            GSTR-2B ITC Leakage & Reverse Charge Optimizer
          </div>
          <div style={{ fontSize: '0.74rem', color: '#7F1D1D' }}>
            Blocked credit on motor vehicles & catering identified and quarantined from GSTR-3B Table 4(A).
          </div>
          <button
            onClick={() => {
              setActiveView('tax');
              showToast('ITC Optimizer', 'Quarantined ₹12,480 ineligible credit.', 'warning');
            }}
            className="btn btn-danger btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Execute ITC Quarantine →
          </button>
        </div>

        {/* CMA Tool 3 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success-500)' }}>Material Variance Analysis</span>
            <span className="badge badge-success">Favorable Variance +4.2%</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Standard vs Actual Direct Cost Matrix
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Material Price Variance: +₹42,000 (F) | Material Usage Variance: -₹11,000 (A).
          </div>
          <button
            onClick={() => {
              setActiveView('analytics');
              showToast('Variance Matrix', 'Standard cost variance sheets generated.', 'info');
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Inspect SKU Margins →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: CS (Company Secretary)
  const renderCsHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            CS MCA V3 Filings & Corporate Governance Command Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Annual Returns (MGT-7, AOC-4), Board Resolutions, Director DIN & Secretarial Compliance Audits
          </p>
        </div>
        <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
          Company Secretary (FCS)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* CS Tool 1 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Form AOC-4 Financials Filing</span>
            <span className="badge badge-success">Ready for V3 Upload</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Standalone Audited Financials & Director Report
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Schedule III Balance sheet, P&L, and Board approval resolution linked.
          </div>
          <button
            onClick={() => showToast('MCA AOC-4 Verified', 'Pre-scrutiny passed on MCA V3 Portal.', 'success')}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Execute MCA Pre-Scrutiny →
          </button>
        </div>

        {/* CS Tool 2 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning-500)' }}>Form MGT-7 Annual Return</span>
            <span className="badge badge-warning">AGM Notice Attached</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Shareholding Pattern & Board Meetings Roster
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            4 Statutory Board meetings and 1 AGM quorum verified under Section 173.
          </div>
          <button
            onClick={() => showToast('MGT-7 Drafter', 'Assembled shareholder register & meeting extracts.', 'info')}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Review Meeting Minutes →
          </button>
        </div>

        {/* CS Tool 3 */}
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--info-500)' }}>DIR-3 KYC & Secretarial Audit</span>
            <span className="badge badge-info">3 Directors Active</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Director Identification Number (DIN) Verification
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            DIN status active with zero statutory disqualifications under Section 164(2).
          </div>
          <button
            onClick={() => showToast('DIN Status Verified', 'All Director DINs verified on MCA Master Data.', 'success')}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Check MCA Master Data →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: CFO
  const renderCfoHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            CFO Treasury, Runway & Financial Strategy Command Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Cash Burn, Working Capital Runway, EBITDA Expansion & Due Diligence Room
          </p>
        </div>
        <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
          Fractional CFO & Strategy Partner
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success-500)' }}>Operating Cash Runway</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>18.4 Months</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Monthly Net Burn: ₹12.4 Lakhs | Total Bank Balances: ₹2.28 Cr.
          </div>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Working Capital Efficiency</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>DSO 34d / DPO 28d</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Cash Conversion Cycle (CCC): 6 Days. Outstanding ratio is 2.8x.
          </div>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--info-500)' }}>Investor MIS & Due Diligence</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Q3 MIS Pack Ready</div>
          <button
            onClick={() => showToast('MIS Report Pack', 'Compiled MIS pack for board presentation.', 'info')}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '4px', alignSelf: 'flex-start' }}
          >
            Export Board MIS Pack →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: Accountant (Maker)
  const renderAccountantHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Financial Executive & Bookkeeping Workbench (Maker)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Daily Journal Vouchers, e-Invoicing, Vendor Bills Entry & Bank Statement Matching
          </p>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
          Executive Maker
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Create Journal Voucher (Maker)</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Post double-entry accruals, depreciation, and payroll vouchers for checker review.
          </div>
          <button onClick={() => setActiveView('accounting')} className="btn btn-primary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            + Create Voucher →
          </button>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--info-500)' }}>1-Click Bank Statement Matcher</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            4 transactions pending automated match against customer invoices and vendor payments.
          </div>
          <button onClick={() => setActiveView('reconciliation')} className="btn btn-secondary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Open Recon Queue →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: Auditor
  const renderAuditorHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Independent Statutory & Forensic Reviewer Command Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ICFR Testing, Substantive Sampling, Tamper-Proof Audit Hashes & Quality Review Board
          </p>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
          Statutory Quality Reviewer
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Forensic Hash Verification</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            All 142 audit records verified against immutable SHA-256 ledger integrity chain.
          </div>
          <button onClick={() => setActiveView('audit')} className="btn btn-secondary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Inspect Hash Chain →
          </button>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success-500)' }}>ICFR Internal Controls Testing</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Dual maker-checker segregation evaluated for 100% of disbursements exceeding ₹5,00,000.
          </div>
          <button onClick={() => setActiveView('approvals')} className="btn btn-secondary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Review Maker-Checker Logs →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: Internal Admin
  const renderInternalAdminHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Practice Operations & Client Administration Command Hub
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Client Entity Onboarding, Team RBAC Matrix, Engagement Mandates & Workflow SLA Monitoring
          </p>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
          Internal Admin
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Client Entity Setup</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Configure GSTIN, PAN, and assign lead CAs, CMAs, and Maker accountants.
          </div>
          <button onClick={() => setActiveView('clients')} className="btn btn-primary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            + Onboard Client Entity →
          </button>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--info-500)' }}>Role & Permission Matrix (RBAC)</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Enforce least-privilege access rules across client organizations and modules.
          </div>
          <button onClick={() => setActiveView('settings')} className="btn btn-secondary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Manage Team RBAC →
          </button>
        </div>
      </div>
    </div>
  );

  // Role: Super Admin
  const renderSuperAdminHub = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Managing Partner & Super Admin Enterprise Controller
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Global Multi-Tenant Isolation, Cryptographic Audit Vault, and DSC Digital Certificate Policy
          </p>
        </div>
        <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
          Super Admin
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>Firm-Wide Audit Vault</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            100% immutable SHA-256 cryptographic chain validated across all 42 client entities.
          </div>
          <button onClick={() => setActiveView('audit')} className="btn btn-secondary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Inspect Audit Vault →
          </button>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success-500)' }}>Cross-Portal Bridge Health</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Live sync active with Vertofi Business Portal and Legal & Notice Defense Panel.
          </div>
          <button onClick={() => setActiveView('settings')} className="btn btn-primary btn-sm" style={{ marginTop: '4px', alignSelf: 'flex-start' }}>
            Configure Portal Bridges →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 28px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)'
      }}
    >
      {currentUser.role === 'CA' && renderCaHub()}
      {currentUser.role === 'CMA' && renderCmaHub()}
      {currentUser.role === 'CS' && renderCsHub()}
      {currentUser.role === 'CFO' && renderCfoHub()}
      {currentUser.role === 'ACCOUNTANT' && renderAccountantHub()}
      {currentUser.role === 'AUDITOR' && renderAuditorHub()}
      {currentUser.role === 'INTERNAL_ADMIN' && renderInternalAdminHub()}
      {currentUser.role === 'SUPER_ADMIN' && renderSuperAdminHub()}
    </div>
  );
};
