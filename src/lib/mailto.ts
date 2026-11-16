export function buildMailto(parts: {
  user: string;
  domain: string;
  subject?: string;
}): string {
  if (!parts.user || !parts.domain) {
    throw new Error('buildMailto: user and domain are required');
  }
  const url = `mailto:${parts.user}@${parts.domain}`;
  if (parts.subject) {
    return `${url}?subject=${encodeURIComponent(parts.subject)}`;
  }
  return url;
}
