import React from 'react';
import IssueCard from './IssueCard';
import MetricsBar from './MetricsBar';
import ExportButton from './ExportButton';

const mono = { fontFamily: "'Space Mono', monospace" };

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '10px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: '12px',
    ...mono,
  }}>
    {children}
  </div>
);

const SkeletonBlock = ({ width = '100%', delay = '0ms' }) => (
  <div style={{
    height: '42px',
    background: '#111',
    border: '1px solid #1A1A1A',
    marginBottom: '6px',
    width,
    animation: 'skeletonPulse 1.4s ease-in-out infinite',
    animationDelay: delay,
  }} />
);

export default function ReviewPanel({ reviewData, isLoading }) {

  if (isLoading) {
    return (
      <div className="review-content-wrapper">
        <div style={{ marginBottom: '28px' }}>
          <SectionLabel>Analyzing</SectionLabel>
          {[0, 1, 2, 3, 4].map(i => (
            <SkeletonBlock key={i} delay={`${i * 120}ms`} width={i % 2 === 0 ? '100%' : '75%'} />
          ))}
        </div>
        <div>
          <SectionLabel>Processing</SectionLabel>
          {[0, 1, 2].map(i => (
            <SkeletonBlock key={i} delay={`${600 + i * 100}ms`} width={i === 1 ? '60%' : '100%'} />
          ))}
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: '#2A2A2A', fontSize: '13px', letterSpacing: '0.1em', ...mono }}>
          _ AWAITING ANALYSIS<span className="cursor">_</span>
        </span>
      </div>
    );
  }

  const counts = {
    bug: reviewData.issues?.filter(i => i.type === 'bug').length || 0,
    security: reviewData.issues?.filter(i => i.type === 'security').length || 0,
    smell: reviewData.issues?.filter(i => i.type === 'smell').length || 0,
    suggestion: reviewData.issues?.filter(i => i.type === 'suggestion').length || 0,
  };

  return (
    <div className="review-content-wrapper" style={{ padding: '24px 24px 48px' }}>

      {/* Summary + Export */}
      <div className="fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <SectionLabel>Summary</SectionLabel>
          <p style={{ fontSize: '13px', color: '#BBBBBB', lineHeight: 1.8, maxWidth: '500px', ...mono }}>
            {reviewData.summary}
          </p>
        </div>
        <div style={{ flexShrink: 0, paddingTop: '2px' }}>
          <ExportButton reviewData={reviewData} />
        </div>
      </div>

      {/* GitHub source */}
      {reviewData.source && (
        <div className="fade-in-up" style={{
          border: '1px solid #1E1E1E',
          borderLeft: '3px solid #2A2A2A',
          padding: '9px 14px',
          marginBottom: '24px',
          fontSize: '11px',
          color: '#666',
          letterSpacing: '0.04em',
          ...mono,
        }}>
          {reviewData.source.repo} / {reviewData.source.filePath}
        </div>
      )}

      {/* Issue type counts */}
      {reviewData.issues?.length > 0 && (
        <div className="fade-in-up" style={{ display: 'flex', gap: '20px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {counts.bug > 0 && <span style={{ fontSize: '11px', color: '#FF4444', ...mono }}>[BUG] ×{counts.bug}</span>}
          {counts.security > 0 && <span style={{ fontSize: '11px', color: '#FF8800', ...mono }}>[SEC] ×{counts.security}</span>}
          {counts.smell > 0 && <span style={{ fontSize: '11px', color: '#AAAAAA', ...mono }}>[WARN] ×{counts.smell}</span>}
          {counts.suggestion > 0 && <span style={{ fontSize: '11px', color: '#777777', ...mono }}>[INFO] ×{counts.suggestion}</span>}
        </div>
      )}

      {/* Issues */}
      {reviewData.issues?.length > 0 && (
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <SectionLabel>Issues ({reviewData.issues.length})</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {reviewData.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Positives */}
      {reviewData.positives?.length > 0 && (
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <SectionLabel>Positives</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reviewData.positives.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#AAAAAA', lineHeight: 1.7, ...mono }}>
                <span style={{ color: '#AAFF00', flexShrink: 0, fontWeight: 700 }}>+</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="fade-in-up">
        <MetricsBar metrics={reviewData.metrics} />
      </div>
    </div>
  );
}