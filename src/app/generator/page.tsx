'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 内容类型选项
const contentTypes = [
  { value: 'article', label: '文章', description: '博客、新闻、教程等' },
  { value: 'social', label: '社交媒体', description: '微博、朋友圈、小红书等' },
  { value: 'ad', label: '广告文案', description: '产品推广、营销文案' },
  { value: 'email', label: '邮件', description: '商务邮件、营销邮件' },
  { value: 'product', label: '产品描述', description: '电商产品介绍' },
  { value: 'script', label: '脚本', description: '视频脚本、直播话术' },
]

// 图片类型定义
interface Image {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string
  user: {
    name: string
    link: string
  }
}

/**
 * AI内容生成器页面
 */
export default function GeneratorPage() {
  const [selectedType, setSelectedType] = useState('article')
  const [input, setInput] = useState('')
  const [details, setDetails] = useState('')
  const [output, setOutput] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [error, setError] = useState('')

  // 处理生成 - 调用真实的 DeepSeek API
  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('请输入内容描述')
      return
    }

    setIsLoading(true)
    setError('')
    setOutput('')
    setImages([])

    try {
      // 构建完整的输入
      const fullInput = details.trim() 
        ? `${input}\n\n详细要求：${details}` 
        : input

      // 调用后端 API 生成文案
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          input: fullInput,
          options: {
            language: 'zh',
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOutput(data.data)
        
        // 自动搜索相关配图
        fetchImages(input)
      } else {
        setError(data.error || '生成失败，请重试')
      }
    } catch (err: any) {
      console.error('API 调用失败:', err)
      setError('网络错误，请检查连接后重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取配图
  const fetchImages = async (query: string) => {
    setIsLoadingImages(true)
    try {
      const response = await fetch(`/api/images?query=${encodeURIComponent(query)}&count=6`)
      const data = await response.json()
      
      if (data.success) {
        setImages(data.data)
      }
    } catch (err) {
      console.error('图片搜索失败:', err)
    } finally {
      setIsLoadingImages(false)
    }
  }

  // 复制内容
  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    alert('已复制到剪贴板')
  }

  // 下载图片
  const handleDownloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${imageName}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('下载失败，请右键另存图片')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            AI内容创作助手
          </a>
          <a href="/dashboard">
            <Button variant="outline">返回仪表板</Button>
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">AI内容生成器</h1>
          <p className="text-gray-600 mb-8">选择内容类型，输入需求，AI将为您智能创作文案和配图</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 输入区域 */}
            <div className="space-y-6">
              {/* 内容类型选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>选择内容类型</CardTitle>
                  <CardDescription>选择您想要生成的内容类型</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`p-3 text-left rounded-lg border transition ${
                          selectedType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 输入描述 */}
              <Card>
                <CardHeader>
                  <CardTitle>内容描述</CardTitle>
                  <CardDescription>详细描述您想要生成的内容</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题/主题 *</Label>
                    <Input
                      id="title"
                      placeholder="例如：小红书春日穿搭推荐"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">详细要求（可选）</Label>
                    <Textarea
                      id="details"
                      placeholder="例如：需要包含3套穿搭方案，语言风格轻松活泼..."
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? 'AI 正在创作中...' : '开始生成'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 输出区域 */}
            <div className="space-y-6">
              {/* 文案结果 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>生成文案</CardTitle>
                      <CardDescription>AI 为您创作的内容</CardDescription>
                    </div>
                    {output && (
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        复制文案
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                        <p className="text-gray-500 text-sm">AI 正在创作中...</p>
                      </div>
                    </div>
                  ) : output ? (
                    <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {output}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      <p>文案将显示在这里</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 配图推荐 */}
              {(output || isLoadingImages) && (
                <Card>
                  <CardHeader>
                    <CardTitle>推荐配图</CardTitle>
                    <CardDescription>
                      来自 Pexels 的高质量版权图片
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingImages ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-gray-500 text-sm">正在搜索配图...</p>
                        </div>
                      </div>
                    ) : images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {images.map((img) => (
                          <div key={img.id} className="group relative">
                            <img
                              src={img.urls.small}
                              alt={img.alt_description}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open(img.urls.regular, '_blank')}
                              >
                                查看
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownloadImage(img.urls.regular, `image-${img.id}`)}
                              >
                                下载
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    
                    {images.length > 0 && (
                      <p className="text-xs text-gray-500 mt-3">
                        💡 提示：悬停图片可查看大图或下载
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
