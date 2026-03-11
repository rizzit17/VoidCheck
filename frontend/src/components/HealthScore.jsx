import React, { useEffect, useState } from 'react';

const mono = { fontFamily: "'Space Mono', monospace" };

export default function HealthScore({ score }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const color = displayed >= 75 ? '#AAFF00' : displayed >= 50 ? '#F5F5F5' : '#FF4444';

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1, ...mono }}>
        {displayed}
      </span>
      <span style={{ fontSize: '9px', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase', ...mono }}>
        / 100
      </span>
    </div>
  );
}