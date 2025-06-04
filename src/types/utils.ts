/**
 * 工具函数相关类型定义
 */

// 项目名称验证结果
export interface IValidationResult {
    valid: boolean
    message: string
}

// 类型检查函数类型
export type TypeCheckFunction<T> = (value: any) => value is T

// 通用异步操作结果
export interface IAsyncOperationResult<T = any> {
    success: boolean
    data?: T
    error?: Error | string
}

// 网络请求选项
export interface INetworkRequestOptions {
    timeout?: number
    retries?: number
    headers?: Record<string, string>
}

// Git 操作相关类型
export interface IGitOperationOptions {
    branch?: string
    depth?: number
    clone?: boolean
}

// 文件操作选项
export interface IFileOperationOptions {
    force?: boolean
    recursive?: boolean
    backup?: boolean
}

// 进度回调函数类型
export type ProgressCallback = (progress: number, message?: string) => void
