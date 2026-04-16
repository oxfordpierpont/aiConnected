export const appName = 'AI Connected Docs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.SITE_URL ??
  'https://aic-docs.sec-admn.com';

export const gitConfig = {
  user: 'oxfordpierpont',
  repo: 'aiConnected',
  branch: 'main',
};
