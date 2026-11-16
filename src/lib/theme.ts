export function resolveTheme(
  stored: string | null,
  systemDark: boolean
): 'light' | 'dark' {
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return systemDark ? 'dark' : 'light';
}
