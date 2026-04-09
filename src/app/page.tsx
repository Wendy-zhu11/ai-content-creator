import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 首页
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 导航栏 */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          AI内容创作助手
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link href="/auth/register">
            <Button>免费注册</Button>
          </Link>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          用AI赋能内容创作
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          基于 DeepSeek V3 的智能内容生成平台，轻松创作文章、社交媒体、广告文案等多种类型内容
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg">立即开始</Button>
          </Link>
          <Link href="/generator">
            <Button size="lg" variant="outline">体验Demo</Button>
          </Link>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">智能文章生成</h3>
            <p className="text-gray-600">一键生成高质量文章，支持多种主题和风格</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">社交媒体内容</h3>
            <p className="text-gray-600">快速创作吸引眼球的社交媒体帖子</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">广告文案</h3>
            <p className="text-gray-600">生成高转化率的营销文案</p>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="container mx-auto px-4 py-8 border-t mt-16">
        <div className="text-center text-gray-500">
          <p>© 2024 AI内容创作助手. 基于DeepSeek AI技术驱动</p>
        </div>
      </footer>
    </main>
  )
}
