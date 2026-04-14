import { NextRequest, NextResponse } from 'next/server'
import { imageService } from '@/services/unsplash'
import { wanxiangService } from '@/services/wanxiang'

/**
 * API 路由：生成配图
 * GET /api/images?query=xxx&count=6&category=穿搭&content=xxx
 * 
 * 参数说明：
 * - query: 搜索关键词（用于Pexels搜索）
 * - count: 图片数量
 * - category: 内容分类（用于AI生图提示词优化）
 * - content: 完整内容（用于AI生图提示词生成）
 * - mode: 图片模式 'search'(搜索) | 'generate'(AI生图) | 'auto'(自动选择)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const count = parseInt(searchParams.get('count') || '6', 10)
    const category = searchParams.get('category') || ''
    const content = searchParams.get('content') || ''
    const mode = searchParams.get('mode') || 'auto'

    let images: any[] = []

    // 根据模式选择图片来源
    if (mode === 'generate' || (mode === 'auto' && wanxiangService.isAvailable() && content)) {
      // AI生图模式
      console.log('使用AI生图:', { category, contentLength: content.length })
      
      // 生成图片提示词
      const prompt = wanxiangService.generatePromptFromContent(content || query, category)
      
      // 生成图片（生成较少张，因为AI生图较慢）
      const generatedUrls = await wanxiangService.generateImage(prompt, 'photograph')
      
      images = generatedUrls.slice(0, 3).map((url, index) => ({
        id: `ai-${Date.now()}-${index}`,
        urls: {
          small: url,
          regular: url,
          full: url,
        },
        alt_description: `AI生成配图 - ${query}`,
        source: '通义万相 AI生成',
      }))
      
      // 如果AI生图失败或数量不足，用Pexels补充
      if (images.length < count && query) {
        const pexelsImages = await imageService.searchImages(query, count - images.length)
        images = [...images, ...pexelsImages]
      }
    } else {
      // 搜索模式（默认）
      console.log('使用图片搜索:', query)
      images = await imageService.searchImages(query, count)
    }

    return NextResponse.json({
      success: true,
      data: images,
      meta: {
        mode: images[0]?.source?.includes('AI') ? 'generate' : 'search',
        count: images.length,
      }
    })
  } catch (error: any) {
    console.error('图片生成错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '图片生成失败',
      },
      { status: 500 }
    )
  }
}

/**
 * POST 接口：专门用于AI生图
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, category = '生活', count = 3 } = body

    if (!content) {
      return NextResponse.json(
        { success: false, error: '缺少内容参数' },
        { status: 400 }
      )
    }

    // 检查AI生图服务是否可用
    if (!wanxiangService.isAvailable()) {
      return NextResponse.json(
        { success: false, error: 'AI生图服务未配置' },
        { status: 503 }
      )
    }

    // 生成图片提示词
    const prompt = wanxiangService.generatePromptFromContent(content, category)
    console.log('AI生图提示词:', prompt)

    // 生成图片
    const generatedUrls = await wanxiangService.generateImage(prompt, 'photograph')

    const images = generatedUrls.slice(0, count).map((url, index) => ({
      id: `ai-${Date.now()}-${index}`,
      urls: {
        small: url,
        regular: url,
        full: url,
      },
      alt_description: `AI生成配图`,
      source: '通义万相',
    }))

    return NextResponse.json({
      success: true,
      data: images,
      meta: {
        prompt,
        category,
        count: images.length,
      }
    })
  } catch (error: any) {
    console.error('AI生图错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI生图失败',
      },
      { status: 500 }
    )
  }
}
