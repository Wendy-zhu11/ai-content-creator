import axios from 'axios'

/**
 * 通义万相 API 服务
 * 文档：https://help.aliyun.com/zh/dashscope/developer-reference/api-details
 */
class WanxiangService {
  private apiKey: string
  private baseUrl: string = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'

  constructor() {
    this.apiKey = process.env.WANXIANG_API_KEY || process.env.DASHSCOPE_API_KEY || ''
  }

  /**
   * 生成图片
   * @param prompt 图片描述提示词
   * @param style 风格：<photograph|anime|3d_cartoon|sketch|oil_painting|watercolor>
   * @returns 图片URL列表
   */
  async generateImage(
    prompt: string,
    style: 'photograph' | 'anime' | '3d_cartoon' | 'sketch' | 'oil_painting' | 'watercolor' = 'photograph'
  ): Promise<string[]> {
    if (!this.apiKey) {
      console.error('通义万相 API Key 未配置')
      return []
    }

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'wanx-v1',
          input: {
            prompt: this.optimizePrompt(prompt),
          },
          parameters: {
            style: style,
            size: '1024*1024',
            n: 1, // 生成1张图
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-Async': 'enable', // 异步模式
          },
        }
      )

      // 异步任务，需要轮询获取结果
      if (response.data.output?.task_id) {
        return await this.pollTaskResult(response.data.output.task_id)
      }

      // 同步返回结果
      if (response.data.output?.results) {
        return response.data.output.results.map((r: any) => r.url)
      }

      return []
    } catch (error: any) {
      console.error('通义万相生成失败:', error.response?.data || error.message)
      return []
    }
  }

  /**
   * 轮询异步任务结果
   */
  private async pollTaskResult(taskId: string, maxAttempts: number = 30): Promise<string[]> {
    const pollUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(pollUrl, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        })

        const status = response.data.output?.task_status
        
        if (status === 'SUCCEEDED') {
          return response.data.output.results?.map((r: any) => r.url) || []
        }
        
        if (status === 'FAILED') {
          console.error('通义万相任务失败:', response.data.output?.message)
          return []
        }

        // 等待2秒后重试
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error('轮询任务失败:', error)
      }
    }

    return []
  }

  /**
   * 优化提示词，使其更适合AI生图
   */
  private optimizePrompt(prompt: string): string {
    // 如果提示词太短，补充细节
    if (prompt.length < 20) {
      return `${prompt}, high quality, beautiful lighting, professional photography`
    }
    
    // 添加质量关键词
    const qualityKeywords = [
      'high quality',
      'professional photography',
      'soft lighting',
      'aesthetic',
    ]
    
    // 检查是否已包含质量关键词
    const hasQuality = qualityKeywords.some(kw => prompt.toLowerCase().includes(kw))
    
    if (!hasQuality) {
      return `${prompt}, high quality, professional photography, soft lighting`
    }
    
    return prompt
  }

  /**
   * 根据内容类型生成图片提示词
   */
  generatePromptFromContent(content: string, category: string): string {
    // 从内容中提取关键信息
    const keywords = this.extractKeywords(content, category)
    
    // 根据分类构建提示词
    const promptTemplates: Record<string, string> = {
      '穿搭': `${keywords}, fashion photography, outfit styling, beautiful model, soft natural lighting, aesthetic background`,
      '美食探店': `${keywords}, food photography, delicious, appetizing, warm lighting, top view, restaurant atmosphere`,
      '旅行攻略': `${keywords}, travel photography, beautiful scenery, golden hour, stunning landscape, cinematic`,
      '美妆': `${keywords}, beauty photography, makeup art, close up portrait, soft lighting, professional model`,
      '生活': `${keywords}, lifestyle photography, cozy atmosphere, natural light, warm tones, aesthetic`,
      '好物推荐': `${keywords}, product photography, minimalist background, soft lighting, high quality, professional`,
    }

    return promptTemplates[category] || `${keywords}, professional photography, high quality, aesthetic`
  }

  /**
   * 从内容中提取关键词
   */
  private extractKeywords(content: string, category: string): string {
    // 简单提取：取前50个字符作为关键词基础
    const cleanContent = content
      .replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100)
    
    // 分类相关词汇
    const categoryWords: Record<string, string[]> = {
      '穿搭': ['outfit', 'fashion', 'style', 'clothing', 'dress', 'look'],
      '美食探店': ['food', 'delicious', 'cuisine', 'dining', 'restaurant', 'tasty'],
      '旅行攻略': ['travel', 'destination', 'scenery', 'landscape', 'vacation', 'tour'],
      '美妆': ['makeup', 'beauty', 'skincare', 'cosmetics', 'glamour'],
      '生活': ['lifestyle', 'daily', 'cozy', 'warm', 'home', 'life'],
      '好物推荐': ['product', 'item', 'goods', 'recommendation', 'quality'],
    }

    const words = categoryWords[category] || ['beautiful']
    
    return `${cleanContent} ${words.slice(0, 2).join(' ')}`
  }

  /**
   * 检查服务是否可用
   */
  isAvailable(): boolean {
    return !!this.apiKey
  }
}

// 导出单例
export const wanxiangService = new WanxiangService()
