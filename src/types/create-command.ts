import { TemplateOriginType } from './template'

// 创建命令上下文
export type CreateActionContext = {
    projectName: string
    originType: TemplateOriginType
    templateName: string
    projectPath: string
}

// 创建命令 Options 参数
export type CreateCommandOptions = {
    template?: string
    force?: boolean
}
