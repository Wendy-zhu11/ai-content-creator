import { NextRequest, NextResponse } from 'next/server'
import { imageService } from '@/services/unsplash'

/**
 * API 路由：搜索配图
 * GET /api/images?query=xxx&count=6
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const count = parseInt(searchParams.get('count') || '6', 10)

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少搜索关键词',
        },
        { status: 400 }
      )
    }

    // 搜索图片
    const images = await imageService.searchImages(query, count)

    return NextResponse.json({
      success: true,
      data: images,
    })
  } catch (error: any) {
    console.error('图片搜索错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '图片搜索失败',
      },
      { status: 500 }
    )
  }
}
