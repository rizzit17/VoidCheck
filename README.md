# 🔍 V0idCh3ck : AI-Powered Code Review Platform

A developer tool that provides instant, AI-powered code reviews. Paste code or enter a GitHub file URL and get a structured report with bugs, suggestions, security issues, and a health score.

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6600?style=flat&logo=data:image/svg+xml;base64,&logoColor=white)

## ✨ Features

- 🧪 **AI Code Review** — Powered by Llama3-70B via Groq, analyzes bugs, security issues, code smells, and suggestions
- 📝 **Monaco Editor** — VS Code's editor component with syntax highlighting and language detection
- 🐙 **GitHub Integration** — Paste a GitHub file URL to review any public repo file
- 📊 **Health Score Gauge** — Animated circular gauge (0–100) with color transitions
- 📄 **PDF Export** — Download a clean report of the review
- 🎨 **Stunning Dark UI** — GitHub-dark inspired design with electric cyan accents and smooth animations

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **Groq API Key** (free) — [Get one here](https://console.groq.com)

### 1. Clone & Setup Backend

```bash
cd V0idCh3ck/backend

# Create your .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend runs on `http://localhost:3001`.

### 2. Setup Frontend

```bash
cd V0idCh3ck/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs on `http://localhost:5173` with an API proxy to the backend.

### 3. Use the App

1. Open `http://localhost:5173` in your browser
2. Paste code in the editor **or** switch to the GitHub tab and enter a file URL
3. Select the language and click **"⚡ Analyze Code"**
4. View your AI review with issues, health score, metrics, and strengths
5. Click **"📄 Export PDF"** to download a report

## 🔑 Getting a Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** in the dashboard
4. Click **"Create API Key"**
5. Copy the key and paste it in `backend/.env` as `GROQ_API_KEY`

> Groq offers generous free tier usage — perfect for development and personal projects.

## 📁 Project Structure

```
V0idCh3ck/
├── backend/
│   ├── index.js              # Express server entry point
│   ├── routes/review.js      # API routes for code review
│   ├── services/aiReview.js  # LangChain + Groq AI integration
│   ├── services/githubFetcher.js  # GitHub file fetcher
│   ├── .env.example          # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main layout & orchestration
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx    # Monaco Editor wrapper
│   │   │   ├── ReviewPanel.jsx   # Review results display
│   │   │   ├── IssueCard.jsx     # Individual issue cards
│   │   │   ├── HealthScore.jsx   # Animated health gauge
│   │   │   ├── MetricsBar.jsx    # Code metrics grid
│   │   │   └── ExportButton.jsx  # PDF export
│   │   ├── index.css         # Design system & styles
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS v4, Monaco Editor |
| Backend | Node.js, Express |
| AI | LangChain, Groq (Llama3-70B) |
| PDF | jsPDF |
| GitHub | GitHub REST API (raw content) |

## 📡 API Endpoints

### `POST /api/review`
Review pasted code.
```json
{ "code": "function hello() {...}", "language": "javascript" }
```

### `POST /api/review/github`
Review a file from GitHub.
```json
{ "repoUrl": "https://github.com/owner/repo/blob/main/src/file.js" }
```

### Response Schema
```json
{
  "healthScore": 72,
  "summary": "Overall summary of the code quality",
  "issues": [
    {
      "type": "bug | smell | suggestion | security",
      "severity": "high | medium | low",
      "line": 14,
      "title": "Issue title",
      "description": "Explanation of the issue",
      "fix": "Suggested fix"
    }
  ],
  "positives": ["What the code does well"],
  "metrics": {
    "complexity": "low | medium | high",
    "readability": "low | medium | high",
    "security": "low | medium | high",
    "performance": "low | medium | high"
  }
}
```

## 📝 License

MIT
