import { ITemplateItem, ITemplateOrigin, TemplateOriginType } from '@/types/template'

export const TemplateOrigin: ITemplateOrigin = {
    gitee: 'https://gitee.com',
    github: 'https://github.com'
}

export const templateList: ITemplateItem[] = []

// 设置模板
export function setTemplateList(list: ITemplateItem[]) {
    // 清空模板列表然后重新设置
    templateList.splice(0, templateList.length, ...list)
}

// 获取模板列表
export function getTemplateList(): ITemplateItem[] {
    return templateList
}

// 检测这个模板名称是否存在于模板列表中
export function checkTemplateExist(templateName: string): boolean {
    return templateList.some(item => item.value === templateName)
}
