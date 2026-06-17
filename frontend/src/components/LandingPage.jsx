import React, { useState, useEffect } from 'react';

const LandingPage = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const fullText = "INITIALIZING V0ID_CH3CK ENVIRONMENT...";

  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setLoadingText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        setProgress(100);
        setIsReady(true);
        clearInterval(progInterval);
      } else {
        setProgress(prog);
      }
    }, 300);

    return () => clearInterval(progInterval);
  }, []);

  const handleEnter = () => {
    if (!isReady) return;
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Wait for fade out transition
  };

  return (
    <div className="landing-container" style={{ opacity: fadingOut ? 0 : 1 }}>
      <div className="landing-scanline"></div>
      <div className="landing-scanline-moving"></div>

      <div className="glitch-wrapper">
        V0idCh3ck
      </div>
      
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3rem', zIndex: 10, textAlign: 'center', padding: '0 1rem' }}>
        &gt; AI-Powered Code Review &amp; Analysis Platform
      </div>

      <div style={{ width: '400px', maxWidth: '85%', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px', color: 'var(--accent-cyan)', fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span style={{ marginRight: '10px' }}>{loadingText}<span className="blink-cursor">_</span></span>
          <span style={{ flexShrink: 0 }}>{Math.floor(progress)}%</span>
        </div>
        
        <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            height: '100%', 
            background: 'var(--accent-cyan)', 
            width: `${progress}%`,
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px var(--accent-cyan)'
          }}></div>
        </div>
      </div>

      <div style={{ height: '60px', marginTop: '2rem', zIndex: 10 }}>
        {isReady && (
          <button className="cyber-btn animate-fade-in-up" onClick={handleEnter}>
            [ ENTER_SYSTEM ]
          </button>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', zIndex: 10 }}>
        v1.0.0 // SECURE CONNECTION ESTABLISHED
      </div>
    </div>
  );
};

export default LandingPage;
