import React, { useState, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import HealthScore from './components/HealthScore';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
];

const SAMPLE_CODE = `// Paste your code here or use the GitHub tab
function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(40));
`;

const mono = { fontFamily: "'Space Mono', monospace" };

export default function App() {
  const [activeTab, setActiveTab] = useState('paste');
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('javascript');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubCode, setGithubCode] = useState('');
  const [githubLang, setGithubLang] = useState('javascript');
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);
  const [error, setError] = useState(null);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  // Animate dots while loading
  React.useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => setLoadingDots(d => d === 3 ? 1 : d + 1), 500);
    return () => clearInterval(id);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (isLoading) return;
    if (activeTab === 'paste' && (!code || code.trim().length < 10)) {
      showError('Please enter at least a few lines of code.');
      return;
    }
    if (activeTab === 'github' && !githubUrl.trim()) {
      showError('Please enter a GitHub file URL.');
      return;
    }

    setIsLoading(true);
    setReviewData(null);
    setError(null);

    try {
      let response;
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      if (activeTab === 'paste') {
        response = await fetch(`${apiUrl}/api/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });
      } else {
        response = await fetch(`${apiUrl}/api/review/github`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl: githubUrl }),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Review failed.');
      if (data.fileContent) {
        setGithubCode(data.fileContent);
        setGithubLang(data.source?.language || 'javascript');
      }
      setReviewData(data);
    } catch (err) {
      showError(err.message || 'Failed to connect. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const ext = { python: 'py', cpp: 'cpp', typescript: 'ts', java: 'java', go: 'go' };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#080808' }}>

      {/* ── Navbar ── */}
      <header style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1A1A1A',
        background: '#080808',
        flexShrink: 0,
        height: '48px',
      }}>
        {/* Wordmark */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderRight: '1px solid #1A1A1A',
          gap: '10px',
          flexShrink: 0,
        }}>
          <span style={{ color: '#AAFF00', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', ...mono }}>
            V0idCh3ck
          </span>
          <span style={{ color: '#2A2A2A', fontSize: '10px', ...mono }}>▸</span>
          <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', ...mono }}>
            AI Review
          </span>
        </div>

        {/* Center: tabs + inputs */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, paddingLeft: '8px' }}>
          <button className={`tab-button ${activeTab === 'paste' ? 'active' : ''}`} onClick={() => setActiveTab('paste')}>
            Paste Code
          </button>
          <button className={`tab-button ${activeTab === 'github' ? 'active' : ''}`} onClick={() => setActiveTab('github')}>
            GitHub URL
          </button>

          {activeTab === 'paste' && (
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px', gap: '0' }}>
              <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', ...mono, marginRight: '8px' }}>
                [ lang
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  className="select-field"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '9px', pointerEvents: 'none', ...mono }}>▾</span>
              </div>
              <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', ...mono, marginLeft: '8px' }}>
                ]
              </span>
            </div>
          )}

          {activeTab === 'github' && (
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px' }}>
              <input
                className="input-field"
                type="text"
                placeholder="https://github.com/owner/repo/blob/main/src/file.js"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                style={{ maxWidth: '480px' }}
              />
            </div>
          )}
        </div>

        {/* Right: health score + analyze */}
        <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #1A1A1A' }}>
          {reviewData && (
            <div style={{ padding: '0 20px', borderRight: '1px solid #1A1A1A' }}>
              <HealthScore score={reviewData.healthScore} />
            </div>
          )}
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={isLoading}
            style={{ height: '100%', borderTop: 'none', borderBottom: 'none', borderRight: 'none' }}
          >
            {isLoading
              ? `ANALYZING ${'.'.repeat(loadingDots)}`
              : 'ANALYZE CODE'}
          </button>
        </div>
      </header>

      {/* ── Main split ── */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: editor */}
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1A1A1A' }}>
          <div style={{
            padding: '6px 16px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: '#222', fontSize: '9px', ...mono }}>●●●</span>
            <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.1em', ...mono }}>
              {activeTab === 'paste'
                ? `code.${ext[language] || 'js'}`
                : reviewData?.source?.fileName || 'github_file'}
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'paste' ? (
              <CodeEditor code={code} onChange={setCode} language={language} />
            ) : githubCode ? (
              <CodeEditor code={githubCode} onChange={setGithubCode} language={githubLang} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ color: '#1E1E1E', fontSize: '12px', letterSpacing: '0.1em', ...mono }}>
                  _ ENTER A GITHUB URL ABOVE<span className="cursor">_</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: review */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080808' }}>
          <div style={{
            padding: '6px 16px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#222', fontSize: '9px', ...mono }}>●●●</span>
              <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.1em', ...mono }}>review_output</span>
            </div>
            {reviewData && (
              <span style={{ color: '#333', fontSize: '9px', letterSpacing: '0.1em', ...mono }}>
                {reviewData.issues?.length || 0} ISSUES
              </span>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ReviewPanel reviewData={reviewData} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* ── Error toast ── */}
      {error && (
        <div className="toast-error">
          <div className="toast-title">Error</div>
          <div className="toast-message">{error}</div>
        </div>
      )}
    </div>
  );
}