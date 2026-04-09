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
 * 稳定的图片集合（使用 Unsplash 官方推荐图片）
 */
const imageCollections: Record<string, string[][]> = {
  'fashion': [
    ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1485968579580-b6d095142e41?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1485968579580-b6d095142e41?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop'],
  ],
  'spring': [
    ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1462275646964-a0e3c8e67f07?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1462275646964-a0e3c8e67f07?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-14590c3332d1d60380f1c0b5c?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-14590c3332d1d60380f1c0b5c?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=800&auto=format&fit=crop'],
  ],
  'food': [
    ['https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1504674900243-08e1e9c4d2c1?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1504674900243-08e1e9c4d2c1?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1473093295044-c0f0f9f5e5e9?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1473093295044-c0f0f9f5e5e9?w=800&auto=format&fit=crop'],
  ],
  'lifestyle': [
    ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1529156061242-2a0f9b77e14d?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1529156061242-2a0f9b77e14d?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1512438248247-f0f2a8a8e9a0?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512438248247-f0f2a8a8e9a0?w=800&auto=format&fit=crop'],
  ],
  'default': [
    ['https://images.unsplash.com/photo-1516321318423-f06c16f3c1b1?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1516321318423-f06c16f3c1b1?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1552664730-d30bca4f25b4?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1552664730-d30bca4f25b4?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1542744173-053c7a46c7e4?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542744173-053c7a46c7e4?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&auto=format&fit=crop'],
    ['https://images.unsplash.com/photo-1531483787630-0d9385b5dc4f?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1531483787630-0d9385b5dc4f?w=800&auto=format&fit=crop'],
  ],
}

/**
 * 图片服务
 */
class ImageService {
  /**
   * 搜索图片
   */
  async searchImages(query: string, count: number = 6): Promise<ImageResult[]> {
    const category = this.getCategory(query)
    const collection = imageCollections[category] || imageCollections['default']
    
    // 随机打乱并返回指定数量
    const shuffled = [...collection].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(count, collection.length))

    return selected.map((img, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      urls: {
        small: img[0],
        regular: img[1],
        full: img[1].replace('w=800', 'w=1600'),
      },
      alt_description: `${query} - 配图 ${index + 1}`,
      source: 'Unsplash',
    }))
  }

  /**
   * 根据查询词判断图片类别
   */
  private getCategory(query: string): string {
    const keywords: Record<string, string> = {
      'fashion': '穿搭,衣服,服装,时尚,搭配',
      'spring': '春日,春天,春季,花开',
      'summer': '夏日,夏天,夏季',
      'autumn': '秋日,秋天,秋季',
      'winter': '冬日,冬天,冬季',
      'food': '美食,食物,餐厅,咖啡,下午茶',
      'lifestyle': '生活,日常,小红书,种草',
    }

    for (const [category, words] of Object.entries(keywords)) {
      if (words.split(',').some(word => query.includes(word))) {
        return category
      }
    }

    return 'default'
  }
}

// 导出单例
export const imageService = new ImageService()
