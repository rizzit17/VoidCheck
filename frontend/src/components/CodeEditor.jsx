import React from 'react';
import Editor from '@monaco-editor/react';
import terminalNoirTheme from '../theme/monacoTheme';

const LANGUAGE_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  java: 'java', cpp: 'cpp', go: 'go',
};

export default function CodeEditor({ code, onChange, language }) {
  const handleMount = (editor, monaco) => {
    monaco.editor.defineTheme('terminal-noir', terminalNoirTheme);
    monaco.editor.setTheme('terminal-noir');
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language] || 'javascript'}
        value={code}
        onChange={val => onChange(val || '')}
        theme="terminal-noir"
        onMount={handleMount}
        options={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          lineHeight: 20,
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          renderLineHighlight: 'line',
          smoothScrolling: true,
          cursorBlinking: 'phase',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: false },
          automaticLayout: true,
          tabSize: 2,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          scrollbar: { verticalScrollbarSize: 3, horizontalScrollbarSize: 3 },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          renderLineHighlightOnlyWhenFocus: false,
        }}
      />
    </div>
  );
}