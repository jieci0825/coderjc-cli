import { ITemplateItem } from './template'

// 创建命令上下文
export type CreateActionContext = {
    projectName: string
    templateName: string
    projectPath: string
    templateItem: ITemplateItem | null
}

// 创建命令 Options 参数
export type CreateCommandOptions = {
    template?: string
    force?: boolean
}
