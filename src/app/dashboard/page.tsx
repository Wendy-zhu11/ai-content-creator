'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Mock 用户数据
const mockUser = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
}

// Mock 内容历史数据
const mockContents = [
  {
    id: '1',
    type: 'article' as const,
    title: 'AI技术发展趋势分析',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'social' as const,
    title: '新年祝福文案',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    type: 'ad' as const,
    title: '电商产品推广文案',
    createdAt: new Date('2024-01-13'),
  },
]

// 内容类型映射
const contentTypeMap: Record<string, string> = {
  article: '文章',
  social: '社交媒体',
  ad: '广告文案',
  email: '邮件',
  product: '产品描述',
  script: '脚本',
  other: '其他',
}

/**
 * 用户仪表板页面
 */
export default function DashboardPage() {
  const [user] = useState(mockUser)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            AI内容创作助手
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎, {user.name}</span>
            <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
              退出登录
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/generator" className="block">
                  <Button className="w-full" variant="outline">
                    + 新建内容
                  </Button>
                </Link>
                <Button className="w-full" variant="ghost">
                  我的历史
                </Button>
                <Button className="w-full" variant="ghost">
                  模板库
                </Button>
                <Button className="w-full" variant="ghost">
                  账号设置
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 统计卡片 */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>总生成次数</CardDescription>
                  <CardTitle className="text-3xl">128</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>本月生成</CardDescription>
                  <CardTitle className="text-3xl">23</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>收藏模板</CardDescription>
                  <CardTitle className="text-3xl">5</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* 最近生成 */}
            <Card>
              <CardHeader>
                <CardTitle>最近生成的内容</CardTitle>
                <CardDescription>查看和管理您的历史内容</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContents.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-500">
                          {contentTypeMap[content.type]} · {content.createdAt.toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
