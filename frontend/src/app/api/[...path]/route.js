import { NextResponse } from 'next/server';
import serverless from 'serverless-http';
import app from '../../../server/app';
import connectDB from '../../../server/config/db';

const serverlessHandler = serverless(app);

async function handler(req, context) {
  // 1. If an external BACKEND_URL is explicitly provided (and not localhost), proxy to it
  const externalBackend = process.env.BACKEND_URL;
  if (externalBackend && externalBackend.startsWith('http') && !externalBackend.includes('127.0.0.1') && !externalBackend.includes('localhost')) {
    const resolvedParams = context?.params ? await context.params : {};
    const pathSegments = resolvedParams?.path || [];
    const subPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
    let base = externalBackend.trim().replace(/\/+$/, '');
    if (base.endsWith('/api')) base = base.slice(0, -4);
    const search = req.nextUrl?.search || '';
    const targetUrl = `${base}/api/${subPath}${search}`;

    try {
      const headers = new Headers();
      req.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
          headers.set(key, value);
        }
      });
      const init = { method: req.method, headers };
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const body = await req.text();
        if (body) init.body = body;
      }
      const response = await fetch(targetUrl, init);
      const data = await response.text();
      return new NextResponse(data, {
        status: response.status,
        headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
      });
    } catch (proxyError) {
      console.warn('[Proxy Notice] External backend unreachable, running embedded serverless:', proxyError.message);
    }
  }

  // 2. Native Vercel Serverless execution
  try {
    await connectDB();
  } catch (dbError) {
    console.error('[DB Error]:', dbError.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed. Please check your MONGO_URI environment variable in Vercel.',
      },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // Ensure x-forwarded-for is present for rate limiters
  if (!headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = '127.0.0.1';
  }

  let body = '';
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.text();
    } catch (e) {
      body = '';
    }
  }

  const event = {
    httpMethod: req.method,
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    headers,
    body: body || null,
    isBase64Encoded: false,
  };

  try {
    const result = await serverlessHandler(event, {});
    const responseHeaders = new Headers();
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        if (value !== undefined && key.toLowerCase() !== 'content-encoding') {
          responseHeaders.set(key, String(value));
        }
      }
    }

    return new NextResponse(result.body, {
      status: result.statusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Serverless Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
