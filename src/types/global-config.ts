import { ITemplateItem } from './template'

export interface IGlobalConfig {
    defaultOrigin: string
    templateOrigins: string[]
    templateList: ITemplateItem[]
}
