/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js 15ではServer Actionsはデフォルトで有効なので設定不要
  experimental: {
    // 必要な場合のみ追加の実験的機能をここに記述
  }
}

export default nextConfig
