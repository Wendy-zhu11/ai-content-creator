'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 登录页面
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: 实现真实的登录逻辑
    console.log('登录:', { email, password })

    // 模拟登录延迟
    setTimeout(() => {
      setIsLoading(false)
      // 跳转到仪表板
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            登录账号
          </CardTitle>
          <CardDescription className="text-center">
            输入您的邮箱和密码登录
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
            <div className="text-sm text-center text-gray-500">
              还没有账号？{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                立即注册
              </Link>
            </div>
            <Link href="/" className="text-sm text-gray-500 hover:text-primary">
              返回首页
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
