import axios from 'axios'

/**
 * 图片搜索结果
 */
export interface ImageResult {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string
  source: string
}

/**
 * Pexels API 响应类型
 */
interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page?: string
}

/**
 * 图片服务 - 使用 Pexels API
 */
class ImageService {
  private pexelsApiKey: string
  private baseUrl: string = 'https://api.pexels.com/v1'

  constructor() {
    this.pexelsApiKey = process.env.PEXELS_API_KEY || ''
  }

  /**
   * 搜索图片
   */
  async searchImages(query: string, count: number = 6): Promise<ImageResult[]> {
    try {
      // 将中文查询转换为精准的英文搜索词
      const searchQueries = this.extractSearchQueries(query)
      
      // 尝试多个搜索词，优先使用最精准的
      for (const searchQuery of searchQueries) {
        const response = await axios.get<PexelsResponse>(`${this.baseUrl}/search`, {
          headers: {
            'Authorization': this.pexelsApiKey,
          },
          params: {
            query: searchQuery,
            per_page: count,
            page: 1,
            orientation: 'portrait',
          },
        })

        if (response.data.photos.length > 0) {
          return response.data.photos.map((photo) => ({
            id: `pexels-${photo.id}`,
            urls: {
              small: photo.src.small,
              regular: photo.src.medium,
              full: photo.src.large,
            },
            alt_description: photo.alt || `${query} - 配图`,
            source: `Pexels - ${photo.photographer}`,
          }))
        }
      }

      return []
    } catch (error) {
      console.error('Pexels API 搜索失败:', error)
      return []
    }
  }

  /**
   * 从用户输入中提取多个搜索关键词（按精准度排序）
   */
  private extractSearchQueries(query: string): string[] {
    const queries: string[] = []
    
    // 场景+风格组合映射（最精准）
    const comboKeywords: Record<string, string> = {
      // 穿搭组合
      '夏日穿搭': 'summer outfit fashion',
      '春日穿搭': 'spring outfit fashion',
      '秋日穿搭': 'autumn outfit fall fashion',
      '冬日穿搭': 'winter outfit fashion',
      '通勤穿搭': 'office outfit work fashion',
      '约会穿搭': 'date night outfit',
      '休闲穿搭': 'casual outfit daily',
      '运动穿搭': 'sporty outfit athletic',
      '度假穿搭': 'vacation outfit resort',
      '学生穿搭': 'student outfit casual',
      '职场穿搭': 'business casual outfit',
      
      // 美食组合
      '美食探店': 'food restaurant cafe',
      '下午茶': 'afternoon tea dessert cafe',
      '甜品': 'dessert sweet cake',
      '咖啡': 'coffee cafe latte',
      '早午餐': 'brunch breakfast',
      '夜宵': 'night food street food',
      '火锅': 'hot pot chinese food',
      '烧烤': 'bbq grilled food',
      
      // 旅行组合
      '旅行攻略': 'travel destination',
      '穷游': 'budget travel backpacking',
      '精致游': 'luxury travel resort',
      '周末短途': 'weekend trip travel',
      '海岛游': 'beach island vacation',
      '古镇': 'ancient town china',
      '城市游': 'city travel urban',
      '自然风光': 'nature landscape mountain',
    }
    
    // 检查组合关键词
    for (const [chinese, english] of Object.entries(comboKeywords)) {
      if (query.includes(chinese)) {
        queries.push(english)
      }
    }
    
    // 单个关键词映射
    const singleKeywords: Record<string, string> = {
      // 穿搭相关
      '穿搭': 'fashion outfit style',
      '衣服': 'clothing fashion',
      '时尚': 'fashion style',
      '风格': 'style fashion',
      '休闲': 'casual relaxed',
      '温柔': 'soft feminine style',
      '甜美': 'sweet cute fashion',
      '优雅': 'elegant fashion',
      '潮流': 'trendy fashion',
      '小个子': 'petite fashion',
      '微胖': 'curvy fashion plus size',
      '显瘦': 'slim outfit',
      
      // 季节
      '夏日': 'summer fashion',
      '春天': 'spring fashion',
      '春季': 'spring',
      '夏天': 'summer',
      '秋天': 'autumn fall',
      '冬季': 'winter fashion',
      '冬天': 'winter',
      
      // 美食相关
      '美食': 'food delicious',
      '餐厅': 'restaurant dining',
      '探店': 'cafe shop interior',
      '好吃': 'tasty food',
      '吃货': 'food lover',
      '烹饪': 'cooking kitchen',
      '食谱': 'recipe food',
      
      // 旅行相关
      '旅行': 'travel vacation',
      '旅游': 'travel tourism',
      '攻略': 'travel guide',
      '景点': 'tourist attraction',
      '打卡': 'instagram spot',
      '酒店': 'hotel resort',
      '民宿': 'airbnb accommodation',
      
      // 生活相关
      '生活': 'lifestyle daily',
      '日常': 'daily life routine',
      '家居': 'home interior decor',
      '房间': 'room bedroom',
      '收纳': 'organization storage',
      '好物': 'product recommendation',
      
      // 美妆相关
      '美妆': 'makeup beauty',
      '化妆': 'makeup cosmetic',
      '护肤': 'skincare beauty',
      '口红': 'lipstick makeup',
      '妆容': 'makeup look',
      
      // 地点
      '大理': 'dali china travel',
      '成都': 'chengdu china',
      '重庆': 'chongqing china',
      '上海': 'shanghai city',
      '北京': 'beijing china',
      '杭州': 'hangzhou china',
      '厦门': 'xiamen china',
      '三亚': 'sanya beach',
      '丽江': 'lijiang china',
      '西安': 'xian china',
    }
    
    // 提取匹配的单个关键词
    const matchedKeywords: string[] = []
    for (const [chinese, english] of Object.entries(singleKeywords)) {
      if (query.includes(chinese)) {
        matchedKeywords.push(english)
      }
    }
    
    // 如果有匹配的关键词，组合使用
    if (matchedKeywords.length > 0) {
      // 取前两个关键词组合
      queries.push(matchedKeywords.slice(0, 2).join(' '))
      // 也添加单个关键词作为备选
      queries.push(...matchedKeywords)
    }
    
    // 最后添加通用关键词作为兜底
    queries.push('lifestyle')
    
    // 去重
    return Array.from(new Set(queries))
  }

  /**
   * 旧方法：单个关键词翻译（保留兼容）
   */
  private translateQuery(query: string): string {
    const queries = this.extractSearchQueries(query)
    return queries[0] || 'lifestyle'
  }
}

// 导出单例
export const imageService = new ImageService()
