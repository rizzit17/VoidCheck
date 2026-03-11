import React, { useState } from 'react';

const mono = { fontFamily: "'Space Mono', monospace" };

const TYPE_CONFIG = {
  bug: { tag: '[BUG]', color: '#FF4444' },
  security: { tag: '[SEC]', color: '#FF8800' },
  smell: { tag: '[WARN]', color: '#AAAAAA' },
  suggestion: { tag: '[INFO]', color: '#777777' },
};

const SEVERITY_DOT = {
  high: '#FF4444',
  medium: '#AAAAAA',
  low: '#444444',
};

export default function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[issue.type] || TYPE_CONFIG.suggestion;
  const dotColor = SEVERITY_DOT[issue.severity] || SEVERITY_DOT.low;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`fade-in-up`}
      style={{
        background: '#111',
        border: '1px solid #222',
        borderLeft: expanded ? '3px solid #AAFF00' : '3px solid transparent',
        padding: '14px 16px',
        cursor: 'pointer',
        animationDelay: `${index * 60}ms`,
        transition: 'background 0.1s, border-left-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#171717'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#111'; }}
    >
      {/* Tag row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: config.color, letterSpacing: '0.05em', ...mono }}>
          {config.tag}
        </span>
        {issue.line && (
          <span style={{ fontSize: '11px', color: '#666', ...mono }}>LINE {issue.line}</span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: dotColor }}>●</span>
      </div>

      {/* Title */}
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0F0F0', lineHeight: 1.4, marginBottom: '6px', ...mono }}>
        {issue.title}
      </div>

      {/* Description */}
      <div style={{ fontSize: '12px', color: '#999', lineHeight: 1.75, ...mono }}>
        {issue.description}
      </div>

      {/* Expanded fix */}
      {expanded && issue.fix && (
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #1E1E1E' }}>
          <div style={{ fontSize: '9px', color: '#AAFF00', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', ...mono }}>
            Suggested Fix
          </div>
          <div style={{
            background: '#0D0D0D',
            border: '1px solid #1E1E1E',
            padding: '12px 14px',
            fontSize: '12px',
            color: '#CCCCCC',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            ...mono,
          }}>
            {issue.fix}
          </div>
        </div>
      )}
    </div>
  );
}