import type { ContentType, GenerateOptions, ApiResponse } from '@/types'

/**
 * Mock AI 服务（用于开发和测试）
 */
class MockAIService {
  /**
   * 模拟生成内容
   * @param type - 内容类型
   * @param input - 用户输入
   * @param options - 生成选项
   * @returns 生成的 Mock 内容
   */
  async generate(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): Promise<ApiResponse<string>> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 根据类型生成不同的 Mock 内容
    const mockContent = this.getMockContent(type, input, options)

    return {
      success: true,
      data: mockContent,
    }
  }

  /**
   * 获取 Mock 内容
   */
  private getMockContent(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): string {
    const typeNames: Record<ContentType, string> = {
      article: '文章',
      social: '社交媒体内容',
      ad: '广告文案',
      email: '邮件',
      product: '产品描述',
      script: '脚本',
      other: '内容',
    }

    const tone = options?.tone || 'professional'
    const length = options?.length || 'medium'

    return `# ${typeNames[type]}：${input}

这是一段由 AI 内容创作助手生成的${typeNames[type]}示例。

## 核心内容

根据您的需求"${input}"，我们为您创作了以下内容：

### 要点一：背景介绍

在当今快速发展的时代，${input}已经成为一个备受关注的话题。无论是从技术角度还是应用层面，都展现出了巨大的潜力和价值。

### 要点二：核心价值

- **创新性**：打破传统思维，提供全新的解决方案
- **实用性**：能够直接应用于实际场景，解决真实问题
- **前瞻性**：把握未来趋势，抢占先机

### 要点三：实施建议

1. 明确目标和方向
2. 制定详细的执行计划
3. 持续迭代优化
4. 关注用户反馈

## 总结

${input}是一个充满机遇的领域，我们需要保持学习和探索的态度，不断突破自我，创造更大的价值。

---

*说明：这是一个演示版本生成的 Mock 内容。配置 DeepSeek API Key 后将生成真实的 AI 内容。*

**配置参数**：
- 内容类型：${typeNames[type]}
- 语言风格：${tone}
- 篇幅：${length}`
  }

  /**
   * 模拟流式生成
   */
  async *generateStream(
    type: ContentType,
    input: string,
    options?: GenerateOptions
  ): AsyncGenerator<string, void, unknown> {
    const content = this.getMockContent(type, input, options)
    const words = content.split('')

    // 模拟打字效果
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 20))
      yield word
    }
  }
}

// 导出单例
export const mockAIService = new MockAIService()
