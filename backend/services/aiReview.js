import { ChatGroq } from '@langchain/groq';

const SYSTEM_PROMPT = `You are an expert senior code reviewer. Analyze the provided code and return a JSON review report.

You MUST respond with ONLY valid JSON — no markdown, no code fences, no explanation text. Just raw JSON.

The JSON must follow this EXACT schema:
{
  "healthScore": <number 0-100>,
  "summary": "<string: overall summary of code quality>",
  "issues": [
    {
      "type": "<'bug' | 'smell' | 'suggestion' | 'security'>",
      "severity": "<'high' | 'medium' | 'low'>",
      "line": <number: approximate line number>,
      "title": "<string: short issue title>",
      "description": "<string: detailed explanation>",
      "fix": "<string: suggested fix code or explanation>"
    }
  ],
  "positives": ["<string: things the code does well>"],
  "metrics": {
    "complexity": "<'low' | 'medium' | 'high'>",
    "readability": "<'low' | 'medium' | 'high'>",
    "security": "<'low' | 'medium' | 'high'>",
    "performance": "<'low' | 'medium' | 'high'>"
  }
}

Rules:
- healthScore: 0 = terrible, 100 = perfect
- Include ALL issues you find — bugs, code smells, suggestions, and security vulnerabilities
- Be specific about line numbers
- Provide actionable fix suggestions
- Be thorough but fair in your assessment
- The "positives" array should highlight genuinely good aspects of the code
- If the code is very short or trivial, adjust your review accordingly`;

function sanitizeCode(code, maxTokens = 3000) {
  let sanitized = code.replace(/\r\n/g, '\n').trim();

  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  if (sanitized.length > maxChars) {
    sanitized = sanitized.substring(0, maxChars);
    sanitized += '\n// ... (code truncated for analysis)';
  }

  return sanitized;
}

export async function reviewCode(code, language = 'javascript') {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Please set it in your .env file.');
  }

  const sanitizedCode = sanitizeCode(code);

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    maxTokens: 4096,
  });

  const prompt = `Review the following ${language} code:\n\n\`\`\`${language}\n${sanitizedCode}\n\`\`\``;

  try {
    const response = await llm.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ]);

    const content = response.content.trim();

    // Try to extract JSON from the response
    let jsonStr = content;

    // Remove markdown code fences if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const result = JSON.parse(jsonStr);

    // Validate the structure
    if (typeof result.healthScore !== 'number' || !Array.isArray(result.issues)) {
      throw new Error('Invalid response structure from AI');
    }

    // Clamp health score
    result.healthScore = Math.max(0, Math.min(100, Math.round(result.healthScore)));

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON. Please try again.');
    }
    throw error;
  }
}
