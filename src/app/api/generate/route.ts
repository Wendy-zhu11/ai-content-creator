import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai'
import type { GenerateRequest } from '@/types'

/**
 * API 路由：生成内容
 * POST /api/generate
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: GenerateRequest = await request.json()

    // 验证必填字段
    if (!body.type || !body.input) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填字段：type 和 input',
        },
        { status: 400 }
      )
    }

    // 调用 AI 服务生成内容
    const result = await aiService.generate(body.type, body.input, body.options)

    // 返回结果
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('API 错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '服务器内部错误',
      },
      { status: 500 }
    )
  }
}
