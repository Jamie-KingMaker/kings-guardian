// src/utils/sanitize.js
// Sanitization utilities for AI-generated content
// All AI responses contain untrusted markdown/HTML and must be sanitized before rendering

/**
 * Convert markdown text to plaintext, stripping out markdown syntax and potential XSS.
 * Preserves the semantic content while removing all formatting.
 *
 * @param {string} markdown - Markdown-formatted text from API
 * @returns {string} Safe plaintext for display
 */
export function sanitizeMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  let text = markdown;

  // Remove markdown bold: **text** → text
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');
  // Remove markdown italic: *text* → text (but preserve ** patterns first)
  text = text.replace(/\*(.+?)\*/g, '$1');

  // Remove markdown links: [text](url) → text
  text = text.replace(/\[(.+?)\]\(.+?\)/g, '$1');

  // Remove markdown code: `code` → code
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove HTML tags entirely (defensive against accidental markup)
  text = text.replace(/<[^>]+>/g, '');

  // Remove script-like patterns
  text = text.replace(/javascript:/gi, '');
  text = text.replace(/on\w+\s*=/gi, '');

  // Clean up whitespace
  text = text.trim();

  return text;
}

/**
 * Sanitize a list of AI insights for safe display in bullet lists.
 *
 * @param {string[]} insights - Array of markdown-formatted insight strings
 * @returns {string[]} Array of sanitized plaintext insights
 */
export function sanitizeInsights(insights) {
  if (!Array.isArray(insights)) return [];
  return insights.map(insight => sanitizeMarkdown(insight)).filter(Boolean);
}

/**
 * Sanitize AI chat reply text.
 *
 * @param {string} reply - Markdown-formatted reply from AI
 * @returns {string} Safe plaintext for display
 */
export function sanitizeChatReply(reply) {
  return sanitizeMarkdown(reply);
}

/**
 * Optional future integration: use DOMPurify if additional HTML sanitization is needed.
 * Currently using simple regex-based approach which is sufficient for our markdown conventions.
 *
 * Install with: npm install dompurify
 * Then uncomment the import and use DOMPurify.sanitize() for full HTML support.
 */
// import DOMPurify from 'dompurify';
// export function sanitizeHtml(dirtyHtml) {
//   return DOMPurify.sanitize(dirtyHtml, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code'] });
// }

