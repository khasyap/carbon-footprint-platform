import { NextResponse } from 'next/server';

const getBackendUrl = () => {
  let backendUrl =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:5000';

  backendUrl = backendUrl.trim().replace(/\/+$/, '');
  if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    backendUrl = `http://${backendUrl}`;
  }
  if (backendUrl.endsWith('/api')) {
    backendUrl = backendUrl.slice(0, -4);
  }
  return backendUrl;
};

async function handler(req, context) {
  const resolvedParams = context?.params ? await context.params : {};
  const pathSegments = resolvedParams?.path || [];
  const subPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  const backendBase = getBackendUrl();
  const search = req.nextUrl?.search || '';
  const targetUrl = `${backendBase}/api/${subPath}${search}`;

  try {
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Skip headers that should not be forwarded to avoid upstream SSL / proxy issues
      if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
        headers.set(key, value);
      }
    });

    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text();
      if (body) {
        init.body = body;
      }
    }

    const response = await fetch(targetUrl, init);
    const contentType = response.headers.get('content-type') || 'application/json';
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error(`[API Proxy Error] Failed to proxy ${req.method} to ${targetUrl}:`, error.message);
    return NextResponse.json(
      {
        success: false,
        message: `Backend service is temporarily unreachable or starting up. Please try again shortly. (${error.message})`,
      },
      { status: 503 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
