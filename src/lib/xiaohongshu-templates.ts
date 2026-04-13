/**
 * 小红书爆款模板库
 * 数据来源：2024-2025年小红书爆款笔记分析
 * 更新时间：每周自动更新
 */

export interface XiaohongshuTemplate {
  id: string
  category: string
  name: string
  source: string // 来源：爆款分析/用户提交
  metrics: {
    avgEngagement: number // 平均互动量
    usageCount: number // 使用次数
    satisfaction: number // 用户满意度
  }
  structure: {
    title: TitleTemplate
    opening: OpeningTemplate
    body: BodyTemplate
    closing: ClosingTemplate
    tags: TagTemplate
  }
  createdAt: string
  expiresAt: string
  status: 'active' | 'archived' | 'testing'
}

export interface TitleTemplate {
  patterns: string[]
  examples: string[]
  lengthRange: [number, number]
  mustHave: string[]
  emojiRules: {
    position: 'start' | 'end' | 'both' | 'any'
    count: [number, number]
  }
}

export interface OpeningTemplate {
  patterns: string[]
  examples: string[]
  lengthRange: [number, number]
  techniques: string[]
}

export interface BodyTemplate {
  structure: string[]
  paragraphCount: [number, number]
  paragraphLength: [number, number]
  techniques: string[]
}

export interface ClosingTemplate {
  patterns: string[]
  examples: string[]
  interactionTypes: string[]
}

export interface TagTemplate {
  count: [number, number]
  categories: string[]
  hotTags: string[]
}

/**
 * 穿搭类爆款模板
 */
export const fashionTemplates: XiaohongshuTemplate[] = [
  {
    id: 'fashion_001',
    category: '穿搭',
    name: '数字列表式穿搭推荐',
    source: '爆款分析-2024',
    metrics: {
      avgEngagement: 45000,
      usageCount: 0,
      satisfaction: 0,
    },
    structure: {
      title: {
        patterns: [
          'emoji + 数字 + 场景/季节 + 承诺 + emoji',
          '数字 + 套 + 风格 + 承包你的 + 时间',
          '痛点 + 解决方案 + 具体数字',
        ],
        examples: [
          '🌿5套春日穿搭！承包你的整个春天✨',
          '小个子必看！7套显高穿搭显高5cm🔥',
          '微胖女生看过来！3招穿出沙漏腰',
        ],
        lengthRange: [15, 25],
        mustHave: ['数字', 'emoji'],
        emojiRules: {
          position: 'both',
          count: [1, 3],
        },
      },
      opening: {
        patterns: [
          '称呼 + 场景/时间 + 情绪',
          '痛点提问 + 共鸣',
          '数据背书 + 引入',
        ],
        examples: [
          '姐妹们！春天真的来啦🌸',
          '你是不是每天都在纠结穿什么？',
          '根据小红书数据，这种穿法收藏量破10万！',
        ],
        lengthRange: [20, 50],
        techniques: ['痛点共鸣', '称呼拉近', '情绪渲染'],
      },
      body: {
        structure: [
          '👗 Look1：[风格名] - [简短描述]',
          '💡 搭配Tips：[关键技巧]',
          '重复3-5次不同look',
        ],
        paragraphCount: [4, 6],
        paragraphLength: [30, 80],
        techniques: ['数字编号', '分点论述', 'emoji点缀', '技巧提炼'],
      },
      closing: {
        patterns: [
          '互动提问 + emoji',
          '引导行为 + 福利暗示',
          '总结 + 期待互动',
        ],
        examples: [
          '你最喜欢哪一套？评论区告诉我💕',
          '喜欢的姐妹记得点赞收藏哦～下次分享更多穿搭！',
          '下期分享夏日穿搭，记得关注我✨',
        ],
        interactionTypes: ['评论互动', '点赞收藏', '关注引导'],
      },
      tags: {
        count: [4, 6],
        categories: ['#穿搭', '#日常穿搭', '#OOTD'],
        hotTags: ['#小红书穿搭', '#显瘦穿搭', '#显高穿搭', '#通勤穿搭'],
      },
    },
    createdAt: '2024-04-10',
    expiresAt: '2024-07-10',
    status: 'active',
  },
  {
    id: 'fashion_002',
    category: '穿搭',
    name: '对比冲击式',
    source: '爆款分析-2024',
    metrics: {
      avgEngagement: 50000,
      usageCount: 0,
      satisfaction: 0,
    },
    structure: {
      title: {
        patterns: [
          '改造前vs改造后 + 效果',
          '痛点 + 对比 + 结果',
        ],
        examples: [
          '脱衣有肉，穿衣显瘦！微胖女孩必看🔥',
          '改造前臃肿大妈 vs 改造后利落小个子',
          '梨形身材如何显瘦10斤？前后对比太绝了',
        ],
        lengthRange: [15, 28],
        mustHave: ['对比词', 'emoji'],
        emojiRules: {
          position: 'any',
          count: [1, 2],
        },
      },
      opening: {
        patterns: [
          '自我介绍 + 身材数据 + 共鸣',
          '痛点描述 + 情绪渲染',
        ],
        examples: [
          '我159.5cm 116斤，典型的梨形身材...',
          '姐妹们，微胖真的不是罪！',
        ],
        lengthRange: [30, 60],
        techniques: ['数据真实', '身材共鸣', '痛点直击'],
      },
      body: {
        structure: [
          '❌ 错误示范：[描述问题]',
          '✅ 正确穿法：[描述技巧]',
          '💡 原理分析：[为什么有效]',
          '重复2-3组对比',
        ],
        paragraphCount: [4, 8],
        paragraphLength: [40, 100],
        techniques: ['对比展示', '对错标记', '原理解释'],
      },
      closing: {
        patterns: [
          '总结效果 + 互动',
          '鼓励 + 引导',
        ],
        examples: [
          '记住这3招，微胖也能穿出沙漏腰！收藏起来慢慢看💕',
          '你是什么身材？评论区告诉我，下期出专属攻略！',
        ],
        interactionTypes: ['收藏引导', '评论互动', '期待引导'],
      },
      tags: {
        count: [4, 7],
        categories: ['#微胖穿搭', '#显瘦穿搭', '#梨形身材'],
        hotTags: ['#穿搭改造', '#身材优化', '#遮肉穿搭'],
      },
    },
    createdAt: '2024-04-10',
    expiresAt: '2024-07-10',
    status: 'active',
  },
]

/**
 * 美食类爆款模板
 */
export const foodTemplates: XiaohongshuTemplate[] = [
  {
    id: 'food_001',
    category: '美食',
    name: '探店测评式',
    source: '爆款分析-2024',
    metrics: {
      avgEngagement: 35000,
      usageCount: 0,
      satisfaction: 0,
    },
    structure: {
      title: {
        patterns: [
          '地点 + 食物 + 评价',
          '数字 + 推荐 + 场景',
          '隐藏/小众 + 美食 + 情绪',
        ],
        examples: [
          '成都这5家店，本地人都排队！',
          '人均50吃撑！杭州美食攻略🔥',
          '藏在巷子里的小店，太好吃了😭',
        ],
        lengthRange: [12, 22],
        mustHave: ['地名或数字'],
        emojiRules: {
          position: 'end',
          count: [1, 2],
        },
      },
      opening: {
        patterns: [
          '地点 + 场景 + 引入',
          '发现过程 + 惊喜感',
        ],
        examples: [
          '终于在成都找到了正宗的麻辣烫！',
          '跟着导航走了半小时，没想到这么惊艳...',
        ],
        lengthRange: [20, 45],
        techniques: ['地点明确', '惊喜感营造', '引入自然'],
      },
      body: {
        structure: [
          '📍 店名：[店铺信息]',
          '💰 人均：[价格]',
          '✨ 推荐：[具体菜品]',
          '📝 评价：[真实感受]',
          '重复2-4家店',
        ],
        paragraphCount: [4, 8],
        paragraphLength: [30, 80],
        techniques: ['信息结构化', 'emoji图标', '真实评价'],
      },
      closing: {
        patterns: [
          '总结 + 互动',
          '避雷提醒 + 收藏引导',
        ],
        examples: [
          '这几家你吃过几家？评论区来聊聊💬',
          '记得收藏！下次去打卡不踩雷📌',
        ],
        interactionTypes: ['评论互动', '收藏引导'],
      },
      tags: {
        count: [4, 6],
        categories: ['#美食', '#探店', '#吃货'],
        hotTags: ['#美食探店', '#本地美食', '#美食攻略'],
      },
    },
    createdAt: '2024-04-10',
    expiresAt: '2024-07-10',
    status: 'active',
  },
  {
    id: 'food_002',
    category: '美食',
    name: '食谱教程式',
    source: '爆款分析-2024',
    metrics: {
      avgEngagement: 40000,
      usageCount: 0,
      satisfaction: 0,
    },
    structure: {
      title: {
        patterns: [
          '食物名 + 简单/零失败 + 效果',
          '数字 + 步骤 + 食物',
          '懒人/新手 + 食物 + 承诺',
        ],
        examples: [
          '红烧排骨，零失败！比饭店还好吃',
          '3步搞定！懒人版蛋炒饭',
          '新手必学！10分钟搞定一顿饭',
        ],
        lengthRange: [14, 24],
        mustHave: ['食物名', '简单程度提示'],
        emojiRules: {
          position: 'end',
          count: [1, 2],
        },
      },
      opening: {
        patterns: [
          '场景/痛点 + 解决方案',
          '效果展示 + 引入',
        ],
        examples: [
          '每次做饭都失败？教你这招，零失误！',
          '这样做出来的XX，家人都抢着吃！',
        ],
        lengthRange: [20, 40],
        techniques: ['痛点共鸣', '效果吸引'],
      },
      body: {
        structure: [
          '📝 食材准备：[列出食材]',
          '👨‍🍳 制作步骤：',
          'Step 1：[具体步骤]',
          'Step 2：[具体步骤]',
          '...',
          '💡 小Tips：[关键技巧]',
        ],
        paragraphCount: [5, 10],
        paragraphLength: [20, 60],
        techniques: ['步骤清晰', 'emoji图标', 'Tips提炼'],
      },
      closing: {
        patterns: [
          '效果描述 + 互动',
          '难度总结 + 鼓励尝试',
        ],
        examples: [
          '真的巨简单！试试看，不会失败的💕',
          '做好的姐妹来交作业！评论区等你～',
        ],
        interactionTypes: ['鼓励尝试', '作业互动'],
      },
      tags: {
        count: [4, 6],
        categories: ['#美食', '#食谱', '#做饭'],
        hotTags: ['#家常菜', '#懒人食谱', '#新手做饭'],
      },
    },
    createdAt: '2024-04-10',
    expiresAt: '2024-07-10',
    status: 'active',
  },
]

/**
 * 旅行类爆款模板
 */
export const travelTemplates: XiaohongshuTemplate[] = [
  {
    id: 'travel_001',
    category: '旅行',
    name: '攻略式',
    source: '爆款分析-2024',
    metrics: {
      avgEngagement: 30000,
      usageCount: 0,
      satisfaction: 0,
    },
    structure: {
      title: {
        patterns: [
          '地点 + 天数 + 攻略',
          '数字 + 个景点 + 地点',
          '人均 + 地点 + 时间',
        ],
        examples: [
          '大理3天2夜攻略！人均1500玩到嗨',
          '5个拍照绝美的景点！三亚必去',
          '周末去哪玩？杭州2日游攻略',
        ],
        lengthRange: [14, 24],
        mustHave: ['地名', '数字'],
        emojiRules: {
          position: 'end',
          count: [1, 2],
        },
      },
      opening: {
        patterns: [
          '地点 + 亮点引入',
          '时间/预算 + 概览',
        ],
        examples: [
          '终于去了心心念念的大理！',
          '人均1500！3天玩转大理～',
        ],
        lengthRange: [15, 35],
        techniques: ['亮点前置', '预算透明'],
      },
      body: {
        structure: [
          '📅 行程安排',
          'Day 1：[具体行程]',
          '📍 [景点1]：[描述+Tips]',
          '📍 [景点2]：[描述+Tips]',
          '💰 费用：[明细]',
          '🏨 住宿：[推荐]',
          '🍜 美食：[推荐]',
        ],
        paragraphCount: [6, 12],
        paragraphLength: [30, 80],
        techniques: ['时间线清晰', 'emoji图标', '信息结构化'],
      },
      closing: {
        patterns: [
          '总结 + 互动',
          '避坑提醒 + 收藏引导',
        ],
        examples: [
          '这份攻略帮到你的话，记得点赞收藏哦💕',
          '还有什么问题？评论区问我～',
        ],
        interactionTypes: ['收藏引导', '评论互动'],
      },
      tags: {
        count: [4, 7],
        categories: ['#旅行', '#攻略', '#旅游'],
        hotTags: ['#旅行攻略', '#周末去哪玩', '#小众旅行地'],
      },
    },
    createdAt: '2024-04-10',
    expiresAt: '2024-07-10',
    status: 'active',
  },
]

/**
 * 所有模板合集
 */
export const allTemplates: XiaohongshuTemplate[] = [
  ...fashionTemplates,
  ...foodTemplates,
  ...travelTemplates,
]

/**
 * 根据分类获取模板
 */
export function getTemplatesByCategory(category: string): XiaohongshuTemplate[] {
  const categoryMap: Record<string, string> = {
    '穿搭': 'fashion',
    '时尚': 'fashion',
    '美食': 'food',
    '探店': 'food',
    '旅行': 'travel',
    '旅游': 'travel',
  }
  
  const key = categoryMap[category] || category
  
  return allTemplates.filter(t => 
    t.category === category || 
    t.category.toLowerCase().includes(key.toLowerCase())
  )
}

/**
 * 获取热门模板（按互动量排序）
 */
export function getHotTemplates(limit: number = 5): XiaohongshuTemplate[] {
  return [...allTemplates]
    .sort((a, b) => b.metrics.avgEngagement - a.metrics.avgEngagement)
    .slice(0, limit)
}

/**
 * 生成模板使用提示词
 */
export function buildTemplatePrompt(template: XiaohongshuTemplate, userInput: string): string {
  const { title, opening, body, closing, tags } = template.structure
  
  return `你是一位小红书爆款内容创作专家。请根据以下模板结构，为用户生成内容：

【模板名称】${template.name}

【标题要求】
- 格式模式：${title.patterns.join(' 或 ')}
- 示例：${title.examples.join(' | ')}
- 字数：${title.lengthRange[0]}-${title.lengthRange[1]}字
- 必须包含：${title.mustHave.join('、')}
- Emoji：${title.emojiRules.position === 'both' ? '首尾各1个' : title.emojiRules.position === 'end' ? '结尾1-2个' : '任意位置1-2个'}

【开头要求】
- 格式模式：${opening.patterns.join(' 或 ')}
- 示例：${opening.examples.join(' | ')}
- 字数：${opening.lengthRange[0]}-${opening.lengthRange[1]}字
- 技巧：${opening.techniques.join('、')}

【正文要求】
- 结构：
${body.structure.map(s => '  ' + s).join('\n')}
- 段落数：${body.paragraphCount[0]}-${body.paragraphCount[1]}段
- 每段字数：${body.paragraphLength[0]}-${body.paragraphLength[1]}字
- 技巧：${body.techniques.join('、')}

【结尾要求】
- 格式模式：${closing.patterns.join(' 或 ')}
- 示例：${closing.examples.join(' | ')}
- 互动类型：${closing.interactionTypes.join('、')}

【话题标签】
- 数量：${tags.count[0]}-${tags.count[1]}个
- 热门标签：${tags.hotTags.slice(0, 3).join(' ')}

【用户需求】
${userInput}

请严格按照以上模板结构生成内容，确保格式规范、emoji丰富、语气亲切。`
}
