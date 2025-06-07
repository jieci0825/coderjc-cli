import { ITemplateItem, ITemplateOrigin, TemplateOriginType } from '@/types/template'

export const TemplateOrigin: ITemplateOrigin = {
    gitee: 'https://gitee.com',
    github: 'https://github.com'
}

export const TemplateList: ITemplateItem[] = [
    {
        name: 'temp1',
        description: '测试模板',
        value: 'test-temp1'
    },
    {
        name: 'temp2',
        description: '测试模板2',
        value: 'test-temp2'
    }
]

// 检测这个模板名称是否存在于模板列表中
export function checkTemplateExist(templateName: string): boolean {
    return TemplateList.some(item => item.value === templateName)
}
