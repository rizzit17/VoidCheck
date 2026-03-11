import axios from 'axios';

/**
 * Parse a GitHub URL into owner, repo, branch, and file path.
 * Supports formats:
 *   - https://github.com/owner/repo/blob/branch/path/to/file.js
 *   - https://github.com/owner/repo
 */
function parseGitHubUrl(url) {
  const cleaned = url.replace(/\/$/, '').replace(/\.git$/, '');

  // Match: github.com/owner/repo/blob/branch/path
  const blobMatch = cleaned.match(
    /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/
  );
  if (blobMatch) {
    return {
      owner: blobMatch[1],
      repo: blobMatch[2],
      branch: blobMatch[3],
      path: blobMatch[4],
    };
  }

  // Match: github.com/owner/repo (no file path)
  const repoMatch = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (repoMatch) {
    return {
      owner: repoMatch[1],
      repo: repoMatch[2],
      branch: null,
      path: null,
    };
  }

  throw new Error('Invalid GitHub URL format. Please provide a valid GitHub repository or file URL.');
}

/**
 * Fetch raw file contents from GitHub.
 */
export async function fetchGitHubFile(repoUrl, filePath) {
  const parsed = parseGitHubUrl(repoUrl);

  // Use the file path from URL if available, otherwise use the provided filePath
  const targetPath = parsed.path || filePath;

  if (!targetPath) {
    throw new Error(
      'No file path specified. Please provide a direct link to a file (e.g., https://github.com/owner/repo/blob/main/src/index.js) or include a filePath parameter.'
    );
  }

  const branch = parsed.branch || 'main';
  const rawUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}/${targetPath}`;

  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await axios.get(rawUrl, {
      headers,
      timeout: 10000,
      maxContentLength: 500 * 1024, // 500KB max
    });

    if (typeof response.data !== 'string') {
      throw new Error('The fetched content does not appear to be a text file.');
    }

    return {
      content: response.data,
      fileName: targetPath.split('/').pop(),
      filePath: targetPath,
      repo: `${parsed.owner}/${parsed.repo}`,
    };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(
          `File not found: ${targetPath} in ${parsed.owner}/${parsed.repo}. Check the URL and branch name.`
        );
      }
      if (error.response.status === 403) {
        throw new Error(
          'GitHub API rate limit exceeded. Add a GITHUB_TOKEN to your .env file for higher limits.'
        );
      }
    }
    throw new Error(`Failed to fetch file from GitHub: ${error.message}`);
  }
}

/**
 * Detect language from file extension.
 */
export function detectLanguage(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    cs: 'csharp',
    swift: 'swift',
    kt: 'kotlin',
  };
  return languageMap[ext] || 'plaintext';
}
