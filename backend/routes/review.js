import { Router } from 'express';
import { reviewCode } from '../services/aiReview.js';
import { fetchGitHubFile, detectLanguage } from '../services/githubFetcher.js';

const router = Router();

/**
 * POST /api/review
 * Body: { code: string, language: string }
 */
router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide non-empty code to review.',
      });
    }

    if (code.trim().length < 10) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Code is too short to review meaningfully. Please provide at least a few lines.',
      });
    }

    const result = await reviewCode(code, language || 'javascript');
    res.json(result);
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({
      error: 'Review failed',
      message: error.message || 'An unexpected error occurred during code review.',
    });
  }
});

/**
 * POST /api/review/github
 * Body: { repoUrl: string, filePath?: string }
 */
router.post('/github', async (req, res) => {
  try {
    const { repoUrl, filePath } = req.body;

    if (!repoUrl || typeof repoUrl !== 'string' || repoUrl.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide a GitHub repository URL.',
      });
    }

    // Fetch the file from GitHub
    const file = await fetchGitHubFile(repoUrl.trim(), filePath);
    const language = detectLanguage(file.fileName);

    // Run the review
    const result = await reviewCode(file.content, language);

    res.json({
      ...result,
      fileContent: file.content,
      source: {
        repo: file.repo,
        filePath: file.filePath,
        fileName: file.fileName,
        language,
      },
    });
  } catch (error) {
    console.error('GitHub review error:', error.message);
    res.status(500).json({
      error: 'GitHub review failed',
      message: error.message || 'An unexpected error occurred.',
    });
  }
});

export default router;
