export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.trim().replace(/[\s-]/g, "");
  if (/^(\+20|0020)0?1[0125]/.test(cleaned)) {
    return cleaned.replace(/^(\+20|0020)0?/, "0");
  }
  return cleaned;
}
