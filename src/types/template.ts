/**
 * 模板相关类型定义
 */

// 模板项配置接口
export interface ITemplateItem {
    name: string
    description: string
    originUrls: string[]
    value: string
    isStore: boolean
}

// 模板来源常量对象类型
export interface ITemplateOrigin {
    readonly gitee: string
    readonly github: string
}

// 模板来源类型
export type TemplateOriginType = 'gitee' | 'github'
