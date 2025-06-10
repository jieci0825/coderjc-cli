import { ITemplateItem, TemplateOriginType } from './template'

export interface IGlobalConfig {
    defaultOrigin: string
    templateOrigins: Record<TemplateOriginType, string>
    templateList: ITemplateItem[]
}
