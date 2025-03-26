/**
 * Utility functions for handling markdown conversions
 */

/**
 * Converts markdown to HTML for better readability in client
 * Handles common markdown elements like headers, lists, code blocks, etc.
 */
export function markdownToHTML(markdown: string): string {
  if (!markdown) return '';

  let html = markdown
    // Convert headers (# Header) to <h> tags
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Convert bold (**text**) to <strong>
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    
    // Convert italics (*text*) to <em>
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Convert line breaks
    .replace(/\n/gim, '<br>')
    
    // Convert unordered lists
    .replace(/^\s*-\s+(.*$)/gim, '<ul><li>$1</li></ul>')
    
    // Convert ordered lists
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>')
    
    // Convert code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    
    // Convert inline code
    .replace(/`(.*?)`/gim, '<code>$1</code>');
    
  // Clean up duplicate list tags
  html = html
    .replace(/<\/ul><ul>/g, '')
    .replace(/<\/ol><ol>/g, '');
    
  return html;
}

/**
 * Sanitizes markdown content to prevent XSS attacks
 * Use this before displaying user-generated content
 */
export function sanitizeMarkdown(markdown: string): string {
  return markdown
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Process markdown for display (sanitizes and converts to HTML)
 */
export function processMarkdownForDisplay(markdown: string): string {
  return markdownToHTML(sanitizeMarkdown(markdown));
} 