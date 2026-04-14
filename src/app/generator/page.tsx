'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 对话消息类型
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'options' | 'result'
  options?: Option[]
  images?: Image[]
}

interface Option {
  label: string
  value: string
}

interface Image {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string
}

// 对话阶段
type ConversationStage = 'initial' | 'ask_topic' | 'ask_style' | 'generating' | 'completed'

/**
 * 对话式AI内容生成器页面
 */
export default function GeneratorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是AI内容创作助手 ✨\n\n请告诉我你想创作什么类型的内容？',
      type: 'options',
      options: [
        { label: '👗 穿搭分享', value: 'category:穿搭' },
        { label: '🍜 美食探店', value: 'category:美食探店' },
        { label: '✈️ 旅行攻略', value: 'category:旅行攻略' },
        { label: '💄 美妆护肤', value: 'category:美妆' },
        { label: '📝 生活分享', value: 'category:生活' },
        { label: '🛍️ 好物推荐', value: 'category:好物推荐' },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<ConversationStage>('initial')
  const [context, setContext] = useState<{
    category?: string
    topic?: string
    style?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 根据上下文推断正确的阶段，解决状态更新延迟问题
  const inferStage = (
    currentContext: typeof context, 
    currentStage: ConversationStage
  ): ConversationStage => {
    // 如果有主题但没有风格，应该在 ask_style 阶段
    if (currentContext.topic && !currentContext.style) {
      return 'ask_style'
    }
    // 如果有分类但没有主题，应该在 ask_topic 阶段
    if (currentContext.category && !currentContext.topic) {
      return 'ask_topic'
    }
    // 否则使用当前阶段
    return currentStage
  }

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsLoading(true)

    try {
      // 根据上下文推断正确的阶段，避免状态更新延迟问题
      const effectiveStage = inferStage(context, stage)
      
      // 根据当前阶段处理
      const response = await processUserInput(userInput, context, effectiveStage)
      
      setMessages(prev => [...prev, ...response.messages])
      
      if (response.context) {
        setContext(prev => ({ ...prev, ...response.context }))
      }
      
      if (response.nextStage) {
        setStage(response.nextStage)
      }

      // 如果需要生成内容
      if (response.shouldGenerate && response.finalInput) {
        await generateContent(response.finalInput)
      }
    } catch (err) {
      console.error('处理失败:', err)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，处理出错了，请重试一下～',
        type: 'text',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 点击选项
  const handleOptionClick = async (value: string) => {
    // 先添加用户消息
    const optionLabel = value.includes('category:') 
      ? value.replace('category:', '')
      : value.includes('style:') 
        ? value.replace('style:', '')
        : value
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: optionLabel,
      type: 'text',
    }])
    
    setIsLoading(true)
    
    try {
      // 根据输入内容和上下文推断正确的阶段，避免状态更新延迟问题
      const effectiveStage = inferStage(context, stage)
      
      const response = await processUserInput(value, context, effectiveStage)
      
      setMessages(prev => [...prev, ...response.messages])
      
      if (response.context) {
        setContext(prev => ({ ...prev, ...response.context }))
      }
      
      if (response.nextStage) {
        setStage(response.nextStage)
      }

      if (response.shouldGenerate && response.finalInput) {
        await generateContent(response.finalInput)
      }
    } catch (err) {
      console.error('处理失败:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理用户输入
  const processUserInput = async (
    userInput: string, 
    currentContext: typeof context, 
    currentStage: ConversationStage
  ): Promise<{
    messages: Message[]
    context?: typeof context
    nextStage?: ConversationStage
    shouldGenerate?: boolean
    finalInput?: string
  }> => {
    // 处理分类选择
    if (userInput.startsWith('category:')) {
      const category = userInput.replace('category:', '')
      return {
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `好的！${getCategoryEmoji(category)}${category}内容\n\n请告诉我具体的主题是什么？\n比如：「${getCategoryExample(category)}」`,
            type: 'text',
          },
        ],
        context: { category },
        nextStage: 'ask_topic',
      }
    }

    // 处理风格选择
    if (userInput.startsWith('style:')) {
      const style = userInput.replace('style:', '')
      const newContext = { ...currentContext, style }
      const finalInput = `${currentContext.topic || ''}，${style}`
      
      return {
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: '好的！正在为你生成内容... ✨',
            type: 'text',
          },
        ],
        context: newContext,
        nextStage: 'generating',
        shouldGenerate: true,
        finalInput,
      }
    }

    // 初始阶段：识别分类
    if (currentStage === 'initial') {
      const category = detectCategory(userInput)
      return {
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `好的！${getCategoryEmoji(category)}${category}内容\n\n请告诉我具体的主题是什么？`,
            type: 'text',
          },
        ],
        context: { category },
        nextStage: 'ask_topic',
      }
    }

    // 询问主题阶段
    if (currentStage === 'ask_topic') {
      const newContext = { ...currentContext, topic: userInput }
      const followUp = getFollowUpQuestions(currentContext.category || '', userInput)
      
      return {
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: followUp.question,
            type: 'options',
            options: followUp.options.map(opt => ({
              label: opt.label,
              value: `style:${opt.value}`,
            })),
          },
        ],
        context: newContext,
        nextStage: 'ask_style',
      }
    }

    // 询问风格阶段 - 用户手动输入（不是点击选项）
    if (currentStage === 'ask_style') {
      const newContext = { ...currentContext, style: userInput }
      const finalInput = `${currentContext.topic || ''}，${userInput}`
      
      return {
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: '好的！正在为你生成内容... ✨',
            type: 'text',
          },
        ],
        context: newContext,
        nextStage: 'generating',
        shouldGenerate: true,
        finalInput,
      }
    }

    // 默认：直接生成
    return {
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content: '好的！正在为你生成内容... ✨',
        type: 'text',
      }],
      shouldGenerate: true,
      finalInput: userInput,
    }
  }

  // 生成内容
  const generateContent = async (finalInput: string) => {
    try {
      // 调用生成API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'social',
          input: finalInput,
          options: { language: 'zh' },
        }),
      })

      const data = await response.json()

      if (data.success) {
        // 使用AI生成配图
        const imagesResponse = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: data.data,
            category: context.category || '生活',
            count: 3,
          }),
        })
        const imagesData = await imagesResponse.json()
        
        const resultMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.data,
          type: 'result',
          images: imagesData.success ? imagesData.data : [],
        }

        setMessages(prev => [...prev, resultMessage, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '内容已生成！✨\n\n还需要调整吗？',
          type: 'options',
          options: [
            { label: '📝 改短一点', value: 'style:精简版' },
            { label: '🎨 换个风格', value: 'style:活泼风格' },
            { label: '🔄 重新生成', value: 'category:重新生成' },
            { label: '✅ 满意了', value: 'done' },
          ],
        }])
        
        setStage('completed')
      }
    } catch (err) {
      console.error('生成失败:', err)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '生成失败，请重试～',
        type: 'text',
      }])
    }
  }

  // 识别分类
  const detectCategory = (input: string): string => {
    const keywords: Record<string, string[]> = {
      '穿搭': ['穿搭', '衣服', '搭配', '时尚', 'look', 'OOTD'],
      '美食探店': ['美食', '探店', '餐厅', '好吃', '吃货'],
      '旅行攻略': ['旅行', '旅游', '攻略', '景点', '打卡'],
      '美妆': ['化妆', '护肤', '美妆', '彩妆', '口红'],
      '生活': ['生活', '日常', '分享', '经验'],
      '好物推荐': ['好物', '推荐', '种草', '购物'],
    }

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => input.includes(word))) {
        return category
      }
    }
    return '生活'
  }

  // 获取分类emoji
  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      '穿搭': '👗',
      '美食探店': '🍜',
      '旅行攻略': '✈️',
      '美妆': '💄',
      '生活': '📝',
      '好物推荐': '🛍️',
    }
    return emojis[category] || '✨'
  }

  // 获取分类示例
  const getCategoryExample = (category: string): string => {
    const examples: Record<string, string> = {
      '穿搭': '春日穿搭、通勤穿搭、约会穿搭',
      '美食探店': '成都美食、探店测评、餐厅推荐',
      '旅行攻略': '大理攻略、周末短途、穷游攻略',
      '美妆': '日常妆容、护肤心得、好物推荐',
      '生活': '生活日常、经验分享、好物推荐',
      '好物推荐': '居家好物、平价好物、学生党推荐',
    }
    return examples[category] || '任何你想分享的内容'
  }

  // 获取追问问题
  const getFollowUpQuestions = (category: string, topic: string): { question: string; options: Option[] } => {
    if (category === '穿搭') {
      return {
        question: `关于「${topic}」，你想要什么风格？`,
        options: [
          { label: '🌸 温柔甜美', value: '温柔甜美风格' },
          { label: '😎 休闲日常', value: '休闲日常风格' },
          { label: '✨ 精致优雅', value: '精致优雅风格' },
          { label: '🔥 个性潮流', value: '个性潮流风格' },
        ],
      }
    }
    
    if (category === '美食探店') {
      return {
        question: `关于「${topic}」，你想要什么类型的内容？`,
        options: [
          { label: '📍 探店测评', value: '探店测评风格，带价格和推荐' },
          { label: '📖 食谱教程', value: '食谱教程风格，详细步骤' },
          { label: '🏆 好店推荐', value: '好店推荐风格，简洁明了' },
        ],
      }
    }
    
    if (category === '旅行攻略') {
      return {
        question: `关于「${topic}」，你的旅行偏好是？`,
        options: [
          { label: '💰 穷游攻略', value: '穷游预算攻略，省钱实用' },
          { label: '⭐ 精致游', value: '精致游攻略，品质体验' },
          { label: '📅 周末短途', value: '周末短途攻略，2-3天' },
        ],
      }
    }

    return {
      question: '想要什么风格的内容？',
      options: [
        { label: '📝 干货分享', value: '干货分享风格，实用为主' },
        { label: '💬 经验心得', value: '经验心得风格，真实感受' },
        { label: '🎯 种草推荐', value: '种草推荐风格，吸引力强' },
      ],
    }
  }

  // 复制内容
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: '已复制到剪贴板！📋',
      type: 'text',
    }])
  }

  // 下载图片
  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('下载失败，请右键另存图片')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* 导航栏 */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-pink-600">
            AI内容创作助手 ✨
          </a>
          <a href="/">
            <Button variant="ghost" size="sm">返回首页</Button>
          </a>
        </div>
      </nav>

      {/* 对话区域 */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-center">
              💬 智能创作助手
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* 消息列表 */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-pink-500 text-white rounded-2xl rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                    } px-4 py-3`}
                  >
                    {/* 文本内容 */}
                    {message.type === 'text' && (
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    )}

                    {/* 选项内容 */}
                    {message.type === 'options' && (
                      <div className="space-y-2">
                        <p className="text-sm mb-3">{message.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {message.options?.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option.value)}
                              className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-pink-400 hover:text-pink-600 transition"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 结果内容 */}
                    {message.type === 'result' && (
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 text-gray-800 text-sm whitespace-pre-wrap border">
                          {message.content}
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(message.content)}
                            className="px-3 py-1 bg-pink-100 text-pink-600 rounded text-xs hover:bg-pink-200"
                          >
                            📋 复制文案
                          </button>
                        </div>

                        {/* 配图 */}
                        {message.images && message.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {message.images.map((img) => (
                              <div key={img.id} className="group relative">
                                <img
                                  src={img.urls.small}
                                  alt={img.alt_description}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center">
                                  <button
                                    onClick={() => window.open(img.urls.regular, '_blank')}
                                    className="px-2 py-1 bg-white rounded text-xs"
                                  >
                                    查看
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* 加载中 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                      <span className="text-sm text-gray-500">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入你想创作的内容..."
                  className="flex-1 rounded-full"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-full px-6 bg-pink-500 hover:bg-pink-600"
                >
                  发送
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 提示：直接描述你想创作的内容，AI会引导你完成
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
