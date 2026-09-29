import React from 'react';

interface VertofiLogoProps {
  size?: number;
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  textColor?: string;
  className?: string;
}

export const VertofiLogo: React.FC<VertofiLogoProps> = ({
  size = 40,
  showText = true,
  showSubtitle = true,
  subtitle,
  textColor = '#0F172A',
  className = ''
}) => {
  // SVG proportions: 300 x 260 for the icon symbol
  return (
    <div
      className={`vertofi-brand-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size > 48 ? '16px' : '10px',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Official Geometric Vertofi Symbol */}
      <svg
        width={size}
        height={(size * 220) / 240}
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Left Side: Black speed dots & horizontal rounded bars */}
        <g fill="#0F172A">
          {/* Row 1 */}
          <circle cx="58" cy="46" r="6.5" />
          <rect x="74" y="40" width="28" height="12" rx="6" />

          {/* Row 2 */}
          <circle cx="38" cy="80" r="7.5" />
          <rect x="58" y="73" width="44" height="14" rx="7" />

          {/* Row 3 */}
          <rect x="52" y="106" width="18" height="13" rx="6.5" />
          <rect x="80" y="106" width="38" height="13" rx="6.5" />

          {/* Row 4 */}
          <circle cx="68" cy="142" r="6.5" />
          <rect x="84" y="136" width="34" height="12" rx="6" />
        </g>

        {/* Blue Arrow / Chevron Element */}
        <path
          d="M104 22 L144 58 L144 80 L120 58 L120 98 L104 98 Z"
          fill="#1D77F2"
        />

        {/* Golden / Amber Tower Pillar Element */}
        <path
          d="M148 36 L184 48 L184 176 L154 176 L154 154 L164 146 L164 58 L148 52 Z"
          fill="#D98A00"
        />

        {/* Red Triangular Base Element */}
        <path
          d="M148 162 L184 184 L148 184 Z"
          fill="#E52320"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div
            style={{
              fontSize: `${Math.max(14, size * 0.44)}px`,
              fontWeight: 900,
              letterSpacing: '0.22em',
              color: textColor,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase'
            }}
          >
            VERTOFI
          </div>

          {showSubtitle && (
            <div
              style={{
                fontSize: `${Math.max(8.5, size * 0.17)}px`,
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textTransform: 'uppercase'
              }}
            >
              <span style={{ color: '#0F172A' }}>TRANSFORM</span>
              <span style={{ color: '#94A3B8', fontSize: '0.7em' }}>•</span>
              <span style={{ color: '#1D77F2' }}>ACCOUNT</span>
              <span style={{ color: '#94A3B8', fontSize: '0.7em' }}>•</span>
              <span style={{ color: '#D98A00' }}>INTELLIGENCE</span>
              <span style={{ color: '#94A3B8', fontSize: '0.7em' }}>•</span>
              <span style={{ color: '#E52320' }}>GROWTH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
