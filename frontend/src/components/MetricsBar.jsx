import React from 'react';

const mono = { fontFamily: "'Space Mono', monospace" };

const METRICS = [
  { key: 'complexity', label: 'COMPLEXITY' },
  { key: 'readability', label: 'READABILITY' },
  { key: 'security', label: 'SECURITY' },
  { key: 'performance', label: 'PERFORMANCE' },
];

const VALUE_COLOR = {
  low: '#AAFF00',
  medium: '#F5F5F5',
  high: '#FF4444',
};

export default function MetricsBar({ metrics }) {
  if (!metrics) return null;

  return (
    <div>
      <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555', marginBottom: '10px', ...mono }}>
        Metrics
      </div>
      {METRICS.map(({ key, label }, i) => {
        const val = (metrics[key] || 'low').toLowerCase();
        const color = VALUE_COLOR[val] || '#555';
        return (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '9px 0',
              borderBottom: i < METRICS.length - 1 ? '1px solid #1A1A1A' : 'none',
            }}
          >
            <span style={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em', ...mono }}>{label}</span>
            <span style={{ fontSize: '10px', color, fontWeight: 700, letterSpacing: '0.1em', ...mono }}>
              {val.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}