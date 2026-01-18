export const stripHtml = (html: string): string => {
  if (!html) return "";

  // 1. Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ");

  // 2. Decode common entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™");

  // 3. Remove extra whitespace
  return text.replace(/\s+/g, " ").trim();
};

export const getExcerpt = (text: string, maxLength: number = 100): string => {
  const cleanText = stripHtml(text);
  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + "..."
    : cleanText;
};
