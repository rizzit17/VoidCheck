export const detectLanguage = (code) => {
  if (!code || code.trim() === '') return null;

  let scores = {
    javascript: 0,
    typescript: 0,
    python: 0,
    java: 0,
    cpp: 0,
    go: 0
  };

  // Python patterns
  if (/def\s+\w+\s*\(/.test(code)) scores.python += 2;
  if (/import\s+\w+/.test(code)) scores.python += 1;
  if (/print\(/.test(code)) scores.python += 1;
  if (/if\s+__name__\s*==\s*['"]__main__['"]/.test(code)) scores.python += 5;
  if (/^\s*elif\s+/m.test(code)) scores.python += 2;
  if (/^\s*except\s+/m.test(code)) scores.python += 2;
  if (/:\s*$/m.test(code)) scores.python += 1;
  
  // Java patterns
  if (/public\s+class\s+\w+/.test(code)) scores.java += 3;
  if (/public\s+static\s+void\s+main/.test(code)) scores.java += 5;
  if (/System\.out\.print/.test(code)) scores.java += 3;
  if (/import\s+java\./.test(code)) scores.java += 3;
  if (/\bString\b/.test(code)) scores.java += 1;

  // C++ patterns
  if (/#include\s*</.test(code)) scores.cpp += 4;
  if (/std::cout/.test(code)) scores.cpp += 3;
  if (/int\s+main\s*\(\s*\)/.test(code)) scores.cpp += 2;
  if (/using\s+namespace\s+std/.test(code)) scores.cpp += 3;

  // Go patterns
  if (/package\s+main/.test(code)) scores.go += 5;
  if (/func\s+\w+\s*\(/.test(code)) scores.go += 3;
  if (/fmt\.Print/.test(code)) scores.go += 3;
  if (/import\s+\(/m.test(code)) scores.go += 2;

  // JS/TS patterns
  if (/console\.log\(/.test(code)) {
    scores.javascript += 2;
    scores.typescript += 2;
  }
  if (/\b(const|let)\s+\w+\s*=/.test(code)) {
    scores.javascript += 1;
    scores.typescript += 1;
  }
  if (/=>/.test(code)) {
    scores.javascript += 1;
    scores.typescript += 1;
  }
  if (/document\./.test(code) || /window\./.test(code)) {
    scores.javascript += 2;
    scores.typescript += 2;
  }
  
  // TS specific patterns
  if (/interface\s+\w+\s*\{/.test(code)) scores.typescript += 3;
  if (/type\s+\w+\s*=/.test(code)) scores.typescript += 2;
  if (/:\s*(string|number|boolean|any|void)\b/.test(code)) scores.typescript += 3;

  let detected = null;
  let maxScore = 0;
  for (const [lang, score] of Object.entries(scores)) {
    // Require a minimum score of 2 to confidently switch
    if (score > maxScore && score >= 2) { 
      maxScore = score;
      detected = lang;
    }
  }

  // Tie breaker between JS and TS
  if (detected === 'javascript' || detected === 'typescript') {
      if (scores.typescript > scores.javascript) {
          detected = 'typescript';
      } else {
          detected = 'javascript';
      }
  }

  return detected;
};
