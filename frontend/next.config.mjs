/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    let backendUrl =
      process.env.BACKEND_URL ||
      process.env.INTERNAL_BACKEND_URL ||
      'http://127.0.0.1:5000';

    backendUrl = backendUrl.trim().replace(/\/+$/, '');
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      backendUrl = `http://${backendUrl}`;
    }
    if (backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.slice(0, -4);
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
