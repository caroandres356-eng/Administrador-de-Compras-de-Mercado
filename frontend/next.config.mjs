/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.2.7'],
  async rewrites() {
    return [
      {
        source: '/swagger-ui.html',
        destination: 'http://localhost:8080/swagger-ui.html',
      },
      {
        source: '/swagger-ui/:path*',
        destination: 'http://localhost:8080/swagger-ui/:path*',
      },
      {
        source: '/v3/api-docs/:path*',
        destination: 'http://localhost:8080/v3/api-docs/:path*',
      },
    ]
  },
}

export default nextConfig
