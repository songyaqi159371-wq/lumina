import type { VercelRequest, VercelResponse } from '@vercel/node';

// 允许跨域访问的域名白名单
export const ALLOWED_ORIGINS = [
  'https://lumina-4yc.pages.dev',
  'https://lumina-mauve.vercel.app',
];

function getOrigin(req: VercelRequest): string | null {
  const origin = req.headers['origin'] as string | undefined;
  return origin && ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

/**
 * 设置 CORS 头。如果请求是 OPTIONS 预检，直接响应 204 并返回 true，调用方应立即 return。
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = getOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
