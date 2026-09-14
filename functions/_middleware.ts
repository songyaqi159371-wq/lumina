// Cloudflare Pages Functions 中间件
// 处理 CORS 和速率限制

// 允许跨域访问的域名白名单
const ALLOWED_ORIGINS = [
  'https://lumina-4yc.pages.dev',
  'https://lumina-mauve.vercel.app',
];

function getCorsOrigin(requestOrigin: string | null): string | null {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  return null;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 内存中的速率限制器（注意：在 Cloudflare Workers 中，每个请求可能在不同的实例运行）
// 生产环境建议使用 Cloudflare KV 或 Durable Objects 来持久化速率限制数据
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 10; // 每分钟每 IP 的请求数

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function onRequest(context: any) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Static assets must bypass API rate limiting. The gallery requests all card
  // images together, while this limit is intended only for AI API endpoints.
  if (!url.pathname.startsWith('/api/')) {
    const response = await next();
    if (!url.pathname.startsWith('/cards/')) {
      return response;
    }

    const cachedResponse = new Response(response.body, response);
    cachedResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return cachedResponse;
  }

  // 获取客户端 IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // 速率限制检查
  if (!checkRateLimit(ip)) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain',
        'Retry-After': '60',
      },
    });
  }

  const origin = getCorsOrigin(request.headers.get('Origin'));

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...(origin
          ? {
              'Access-Control-Allow-Origin': origin,
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '86400',
              'Vary': 'Origin',
            }
          : {}),
      },
    });
  }

  // 继续处理请求
  const response = await next();

  // 仅对白名单内的来源添加 CORS 头
  const newResponse = new Response(response.body, response);
  if (origin) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin);
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    newResponse.headers.set('Vary', 'Origin');
  }

  return newResponse;
}
