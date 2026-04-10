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
      // 将中文查询转换为英文关键词
      const searchQuery = this.translateQuery(query)
      
      const response = await axios.get<PexelsResponse>(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': this.pexelsApiKey,
        },
        params: {
          query: searchQuery,
          per_page: count,
          page: 1,
          orientation: 'portrait', // 竖版图片，适合小红书
        },
      })

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
    } catch (error) {
      console.error('Pexels API 搜索失败:', error)
      // 如果API失败，返回空数组而不是模拟数据
      return []
    }
  }

  /**
   * 将中文查询转换为英文关键词
   */
  private translateQuery(query: string): string {
    // 中英文关键词映射
    const translations: Record<string, string> = {
      '穿搭': 'fashion outfit',
      '春日': 'spring fashion',
      '春': 'spring',
      '夏日': 'summer fashion',
      '夏': 'summer',
      '秋日': 'autumn fashion',
      '秋': 'autumn fall',
      '冬日': 'winter fashion',
      '冬': 'winter',
      '慵懒': 'casual relaxed',
      '时尚': 'fashion style',
      '衣服': 'clothing outfit',
      '美食': 'food',
      '咖啡': 'coffee',
      '下午茶': 'afternoon tea',
      '甜品': 'dessert',
      '旅行': 'travel',
      '旅游': 'travel vacation',
      '风景': 'landscape scenery',
      '生活': 'lifestyle',
      '日常': 'daily life',
      '家居': 'home interior',
      '化妆': 'makeup beauty',
      '护肤': 'skincare beauty',
      '健身': 'fitness workout',
      '运动': 'sports exercise',
      '工作': 'work office',
      '学习': 'study',
      '读书': 'reading book',
      '音乐': 'music',
      '艺术': 'art',
      '设计': 'design',
      '手帐': 'journal planner',
      '摄影': 'photography',
      '宠物': 'pet cat dog',
      '猫': 'cat',
      '狗': 'dog',
      '花': 'flower',
      '植物': 'plant',
      '城市': 'city urban',
      '街拍': 'street fashion',
      '夜景': 'night city',
    }

    // 查找匹配的翻译
    for (const [chinese, english] of Object.entries(translations)) {
      if (query.includes(chinese)) {
        return english
      }
    }

    // 如果没有匹配，返回通用关键词
    return 'lifestyle'
  }
}

// 导出单例
export const imageService = new ImageService()
