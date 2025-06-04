export interface ITemplateItem {
    name: string
    description: string
    value: string
}

export const TemplateOrigin = {
    gitee: 'https://gitee.com',
    github: 'https://github.com'
} as const

export type TemplateOriginType = keyof typeof TemplateOrigin

export const TemplateList: ITemplateItem[] = [
    {
        name: 'temp1',
        description: '测试模板',
        value: 'temp1'
    },
    {
        name: 'temp2',
        description: '测试模板2',
        value: 'temp2'
    }
]
