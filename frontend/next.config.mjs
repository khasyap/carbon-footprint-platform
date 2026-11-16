/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.INTERNAL_BACKEND_URL ||
      (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:5000' : null);

    // If no external backend URL is specified in production (e.g. Vercel),
    // do not rewrite to 127.0.0.1 to prevent Vercel's DNS_HOSTNAME_RESOLVED_PRIVATE error.
    if (!backendUrl) {
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
