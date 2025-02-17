import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */

  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Conrol-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Conrol-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Conrol-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Content-Range',
            value: 'bytes : 0-9/*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
