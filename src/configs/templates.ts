export interface ITemplateItem {
    name: string
    description: string
    value: string
}

const TEMPLATES: ITemplateItem[] = [
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

export default TEMPLATES
