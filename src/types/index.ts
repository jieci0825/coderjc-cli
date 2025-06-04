/**
 * 类型定义统一导出
 */
import type { TemplateOriginType } from './template'

// 创建命令上下文
export type CreateActionContext = {
    projectName: string
    originType: TemplateOriginType
    templateName: string
}

export type { ITemplateItem, ITemplateOrigin, TemplateOriginType } from './template'

export type { MessageType, IMessageTypeOptions, ColorValue } from './logger'

export type {
    IValidationResult,
    TypeCheckFunction,
    IAsyncOperationResult,
    INetworkRequestOptions,
    IGitOperationOptions,
    IFileOperationOptions,
    ProgressCallback
} from './utils'

export * from './question'
