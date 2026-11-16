/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;

    // Only rewrite if an external backend URL is explicitly configured.
    // Otherwise, all /api/* requests are processed natively by the Next.js serverless route handler.
    if (!backendUrl || backendUrl.includes('127.0.0.1') || backendUrl.includes('localhost')) {
      return [];
    }

    let cleanBackendUrl = backendUrl.trim().replace(/\/+$/, '');
    if (!cleanBackendUrl.startsWith('http://') && !cleanBackendUrl.startsWith('https://')) {
      cleanBackendUrl = `https://${cleanBackendUrl}`;
    }
    if (cleanBackendUrl.endsWith('/api')) {
      cleanBackendUrl = cleanBackendUrl.slice(0, -4);
    }

    return [
      {
        source: '/api/:path*',
        destination: `${cleanBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
