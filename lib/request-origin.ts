/** Accept this app's host, including its exact GitHub Codespaces forwarding URL. */
export function isSameAppOrigin(headers: Headers): boolean {
  try {
    const origin = new URL(headers.get('origin') || '');
    if (!['http:', 'https:'].includes(origin.protocol)) return false;
    if (origin.host === headers.get('host')) return true;
    const name = process.env.CODESPACE_NAME;
    const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
    return !!name && origin.protocol === 'https:' && origin.host === `${name}-3000.${domain}`;
  } catch { return false; }
}
