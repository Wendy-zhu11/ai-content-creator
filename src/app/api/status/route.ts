import { NextResponse } from 'next/server'
import { aiService } from '@/services/ai'

/**
 * API 路由：检查 AI 服务状态
 * GET /api/status
 */
export async function GET() {
  const status = aiService.getStatus()

  return NextResponse.json({
    success: true,
    data: {
      service: 'AI Content Creator API',
      version: '1.0.0',
      ai: status,
      timestamp: new Date().toISOString(),
    },
  })
}
