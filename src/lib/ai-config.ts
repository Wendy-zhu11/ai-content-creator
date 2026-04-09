import type { ContentType, GenerateOptions } from '@/types'

/**
 * AI 服务配置
 */
export const aiConfig = {
  // DeepSeek API 配置
  deepseek: {
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: 'deepseek-chat', // DeepSeek V3 模型
  },

  // 生成参数默认值
  defaultOptions: {
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
  },
}

/**
 * 内容类型对应的提示词模板
 */
export const contentPrompts: Record<ContentType, string> = {
  article: `你是一位专业的内容创作者。请根据用户的需求生成一篇高质量的文章。
要求：
- 结构清晰，逻辑严密
- 语言流畅，易于理解
- 内容有深度，有见解
- 适当使用小标题和列表增强可读性`,

  social: `你是一位社交媒体运营专家。请根据用户需求生成吸引人的社交媒体内容。
要求：
- 内容简洁有力，能快速吸引注意力
- 适当使用emoji增加趣味性
- 易于分享和传播
- 符合社交媒体平台的传播特点`,

  ad: `你是一位资深的广告文案策划师。请根据用户需求生成高转化率的广告文案。
要求：
- 标题吸睛，直击痛点
- 文案有说服力，突出产品优势
- 包含明确的行动号召（CTA）
- 语言简洁有力，易于记忆`,

  email: `你是一位商务沟通专家。请根据用户需求生成专业的邮件内容。
要求：
- 格式规范，结构清晰
- 语言得体，符合商务礼仪
- 重点突出，目的明确
- 语气友好专业`,

  product: `你是一位电商产品文案专家。请根据用户需求生成吸引人的产品描述。
要求：
- 突出产品核心卖点
- 语言生动，激发购买欲望
- 包含产品特色和用户利益点
- 符合电商平台规范`,

  script: `你是一位内容创作专家。请根据用户需求生成视频脚本或直播话术。
要求：
- 内容有节奏感，适合口语表达
- 开头吸引人，结尾有号召
- 结构清晰，逻辑连贯
- 包含必要的场景提示`,

  other: `你是一位全能的内容创作助手。请根据用户需求生成合适的内容。
要求：
- 理解用户意图，提供有价值的内容
- 语言通顺，表达清晰
- 格式美观，便于阅读`,
}

/**
 * 构建完整的提示词
 */
export function buildPrompt(
  type: ContentType,
  input: string,
  options?: GenerateOptions
): string {
  const systemPrompt = contentPrompts[type]

  let userPrompt = input

  // 添加可选参数
  if (options) {
    const optionsText = []
    if (options.tone) {
      const toneMap = {
        professional: '专业正式',
        casual: '轻松随意',
        friendly: '友好亲切',
        formal: '正式严肃',
      }
      optionsText.push(`语气风格：${toneMap[options.tone]}`)
    }
    if (options.length) {
      const lengthMap = {
        short: '简短（200-500字）',
        medium: '中等（500-1000字）',
        long: '详细（1000-2000字）',
      }
      optionsText.push(`篇幅要求：${lengthMap[options.length]}`)
    }
    if (options.language) {
      const langMap = {
        zh: '中文',
        en: '英文',
      }
      optionsText.push(`语言：${langMap[options.language]}`)
    }
    if (optionsText.length > 0) {
      userPrompt = `${input}\n\n${optionsText.join('\n')}`
    }
  }

  return `${systemPrompt}\n\n用户需求：\n${userPrompt}`
}
