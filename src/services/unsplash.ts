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
 * 稳定的图片集合 - 使用 Lorem Picsum（全球CDN，更稳定）
 * 格式: https://picsum.photos/seed/{seed}/{width}/{height}
 */
const imageCollections: Record<string, string[][]> = {
  'fashion': [
    ['fashion1', 'fashion2', 'fashion3', 'fashion4', 'fashion5', 'fashion6'],
    ['outfit1', 'outfit2', 'outfit3', 'outfit4', 'outfit5', 'outfit6'],
    ['style1', 'style2', 'style3', 'style4', 'style5', 'style6'],
  ],
  'spring': [
    ['spring1', 'spring2', 'spring3', 'spring4', 'spring5', 'spring6'],
    ['flower1', 'flower2', 'flower3', 'flower4', 'flower5', 'flower6'],
    ['nature1', 'nature2', 'nature3', 'nature4', 'nature5', 'nature6'],
  ],
  'summer': [
    ['summer1', 'summer2', 'summer3', 'summer4', 'summer5', 'summer6'],
    ['beach1', 'beach2', 'beach3', 'beach4', 'beach5', 'beach6'],
    ['sun1', 'sun2', 'sun3', 'sun4', 'sun5', 'sun6'],
  ],
  'food': [
    ['food1', 'food2', 'food3', 'food4', 'food5', 'food6'],
    ['coffee1', 'coffee2', 'coffee3', 'coffee4', 'coffee5', 'coffee6'],
    ['dessert1', 'dessert2', 'dessert3', 'dessert4', 'dessert5', 'dessert6'],
  ],
  'lifestyle': [
    ['life1', 'life2', 'life3', 'life4', 'life5', 'life6'],
    ['daily1', 'daily2', 'daily3', 'daily4', 'daily5', 'daily6'],
    ['home1', 'home2', 'home3', 'home4', 'home5', 'home6'],
  ],
  'travel': [
    ['travel1', 'travel2', 'travel3', 'travel4', 'travel5', 'travel6'],
    ['city1', 'city2', 'city3', 'city4', 'city5', 'city6'],
    ['road1', 'road2', 'road3', 'road4', 'road5', 'road6'],
  ],
  'default': [
    ['default1', 'default2', 'default3', 'default4', 'default5', 'default6'],
    ['random1', 'random2', 'random3', 'random4', 'random5', 'random6'],
    ['photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6'],
  ],
}

/**
 * 生成Picsum图片URL
 */
function generatePicsumUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
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
    
    // 展平所有种子词并随机选择
    const allSeeds = collection.flat()
    const shuffled = [...allSeeds].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(count, allSeeds.length))

    return selected.map((seed, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      urls: {
        small: generatePicsumUrl(seed, 200, 200),
        regular: generatePicsumUrl(seed, 400, 400),
        full: generatePicsumUrl(seed, 800, 800),
      },
      alt_description: `${query} - 配图 ${index + 1}`,
      source: 'Picsum Photos',
    }))
  }

  /**
   * 根据查询词判断图片类别
   */
  private getCategory(query: string): string {
    const keywords: Record<string, string> = {
      'fashion': '穿搭,衣服,服装,时尚,搭配,style',
      'spring': '春日,春天,春季,花开',
      'summer': '夏日,夏天,夏季',
      'autumn': '秋日,秋天,秋季,秋天穿搭',
      'winter': '冬日,冬天,冬季',
      'food': '美食,食物,餐厅,咖啡,下午茶,甜品',
      'lifestyle': '生活,日常,小红书,种草',
      'travel': '旅行,旅游,景点,打卡',
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
