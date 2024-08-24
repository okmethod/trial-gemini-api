import { marked } from "marked";
import DOMPurify from "dompurify";

async function transMarkdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ["b", "i", "em", "strong", "u"] });
}

async function transMarkdownToSanitizedHtml(markdown: string): Promise<string> {
  return sanitizeHTML(await transMarkdownToHtml(markdown));
}

export default transMarkdownToSanitizedHtml;
