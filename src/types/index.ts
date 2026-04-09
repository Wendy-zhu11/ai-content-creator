// 用户类型定义
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// 内容类型定义
export interface Content {
  id: string
  userId: string
  type: ContentType
  title: string
  input: string
  output: string
  template?: string
  createdAt: Date
  updatedAt: Date
}

// 内容类型枚举
export type ContentType =
  | 'article'      // 文章
  | 'social'       // 社交媒体
  | 'ad'           // 广告文案
  | 'email'        // 邮件
  | 'product'      // 产品描述
  | 'script'       // 脚本
  | 'other'        // 其他

// 内容模板
export interface ContentTemplate {
  id: string
  name: string
  description: string
  type: ContentType
  prompt: string
  isPublic: boolean
  createdAt: Date
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// AI 生成请求
export interface GenerateRequest {
  type: ContentType
  input: string
  template?: string
  options?: GenerateOptions
}

// 生成选项
export interface GenerateOptions {
  tone?: 'professional' | 'casual' | 'friendly' | 'formal'
  length?: 'short' | 'medium' | 'long'
  language?: 'zh' | 'en'
}
