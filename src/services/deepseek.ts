import OpenAI from 'openai'
import { aiConfig, buildPrompt } from '@/lib/ai-config'
import type { ContentType, GenerateOptions, ApiResponse } from '@/types'

/**
 * DeepSeek AI 服务封装
 */
class DeepSeekService {
  private client: OpenAI | null = null

  constructor() {
    // 初始化 OpenAI 客户端（DeepSeek 兼容 OpenAI API）
    if (aiConfig.deepseek.apiKey) {
      this.client = new OpenAI({
        apiKey: aiConfig.deepseek.apiKey,
        baseURL: aiConfig.deepseek.apiUrl,
      })
    }
  }

  /**
   * 检查服务是否可用
   */
  isAvailable(): boolean {
    return this.client !== null
  }

  /**
   * 生成内容
   * @param type - 内容类型
   * @param input - 用户输入
   * @param options - 生成选项
   * @returns 生成的内容
   */
  async generate(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): Promise<ApiResponse<string>> {
    // 检查服务是否可用
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'DeepSeek API Key 未配置，请检查环境变量 DEEPSEEK_API_KEY',
      }
    }

    try {
      // 构建提示词
      const prompt = buildPrompt(type, input, options)

      // 调用 DeepSeek API
      const response = await this.client!.chat.completions.create({
        model: aiConfig.deepseek.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: aiConfig.defaultOptions.temperature,
        max_tokens: aiConfig.defaultOptions.maxTokens,
        top_p: aiConfig.defaultOptions.topP,
      })

      // 提取生成的内容
      const content = response.choices[0]?.message?.content || ''

      return {
        success: true,
        data: content,
      }
    } catch (error: any) {
      console.error('DeepSeek API 调用失败:', error)
      return {
        success: false,
        error: error.message || 'AI 服务调用失败',
      }
    }
  }

  /**
   * 流式生成内容（用于实时展示）
   * @param type - 内容类型
   * @param input - 用户输入
   * @param options - 生成选项
   * @param onChunk - 每个片段的回调函数
   */
  async *generateStream(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): AsyncGenerator<string, void, unknown> {
    if (!this.isAvailable()) {
      throw new Error('DeepSeek API Key 未配置')
    }

    const prompt = buildPrompt(type, input, options)

    try {
      const stream = await this.client!.chat.completions.create({
        model: aiConfig.deepseek.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: aiConfig.defaultOptions.temperature,
        max_tokens: aiConfig.defaultOptions.maxTokens,
        top_p: aiConfig.defaultOptions.topP,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          yield content
        }
      }
    } catch (error: any) {
      console.error('DeepSeek 流式调用失败:', error)
      throw error
    }
  }
}

// 导出单例
export const deepseekService = new DeepSeekService()
