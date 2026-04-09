import type { ContentType, GenerateOptions, ApiResponse } from '@/types'
import { deepseekService } from './deepseek'
import { mockAIService } from './mock-ai'

/**
 * AI 服务统一接口
 * 优先使用真实 API，不可用时降级到 Mock 服务
 */
class AIService {
  private useMock: boolean

  constructor() {
    // 检查是否应该使用 Mock
    this.useMock = !deepseekService.isAvailable()
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
    // 如果配置了真实 API，使用真实服务
    if (!this.useMock && deepseekService.isAvailable()) {
      return deepseekService.generate(type, input, options)
    }

    // 否则使用 Mock 服务
    console.log('[AI Service] 使用 Mock 服务生成内容')
    return mockAIService.generate(type, input, options)
  }

  /**
   * 流式生成内容
   * @param type - 内容类型
   * @param input - 用户输入
   * @param options - 生成选项
   */
  async *generateStream(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): AsyncGenerator<string, void, unknown> {
    if (!this.useMock && deepseekService.isAvailable()) {
      yield* deepseekService.generateStream(type, input, options)
    } else {
      yield* mockAIService.generateStream(type, input, options)
    }
  }

  /**
   * 检查服务状态
   */
  getStatus(): { available: boolean; mode: 'real' | 'mock' } {
    return {
      available: true,
      mode: this.useMock ? 'mock' : 'real',
    }
  }
}

// 导出单例
export const aiService = new AIService()
