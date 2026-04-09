/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格模式
  reactStrictMode: true,

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'AI内容创作助手',
  },
}

module.exports = nextConfig
