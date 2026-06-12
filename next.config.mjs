/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启独立输出模式：构建产物自带最小 node_modules，服务器无需安装依赖
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
