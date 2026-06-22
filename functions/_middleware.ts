// Cloudflare Pages Functions 中间件
// 处理 CORS 和速率限制

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
  const { request, next, env } = context;

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

  // 处理 CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 继续处理请求
  const response = await next();

  // 添加 CORS 头
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return newResponse;
}
