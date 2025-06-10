import { IGlobalConfig, ITemplateItem, TemplateOriginType } from '@/types'
import path from 'path'
import { readJsonFile, writeJsonFile } from './file'

export class ConfigManager {
    private configPath: string
    config: IGlobalConfig

    constructor() {
        this.configPath = path.join(import.meta.dirname, '..', 'global-config.json')
        this.config = this.loadConfig()
    }

    // 加载配置
    private loadConfig() {
        const config = readJsonFile<IGlobalConfig>(this.configPath)!
        return config
    }

    // 保存配置
    private saveConfig() {
        writeJsonFile(this.configPath, this.config, 4)
    }

    // 获取完整的配置
    getConfig(): IGlobalConfig {
        return { ...this.config }
    }

    // 获取指定的配置项
    getConfigKey<K extends keyof IGlobalConfig>(key: K): IGlobalConfig[K] {
        return this.config[key]
    }

    // 获取默认源
    getDefaultOrigin(): string {
        return this.config.defaultOrigin
    }

    // 设置默认源-即默认使用的模板源
    setDefaultOrigin(origin: string) {
        this.config.defaultOrigin = origin
        this.saveConfig()
    }

    // 设置模板源(修改其中一项)-即所有的模板源
    setTemplateOrigin(key: TemplateOriginType, url: string): void {
        if (!this.config.templateOrigins) {
            this.config.templateOrigins = { gitee: '', github: '' }
        }
        this.config.templateOrigins[key] = url
        this.saveConfig()
    }

    // 删除模版源
    delTemplateOrigin(key: TemplateOriginType) {
        if (!this.config.templateOrigins) {
            return
        }
        // 并非删除，而是置空
        this.config.templateOrigins[key] = ''
        this.saveConfig()
    }

    // 获取所有模板源
    getTemplateOrigins(): Record<TemplateOriginType, string> {
        return this.config.templateOrigins || {}
    }

    // 获取所有可选的模板列表
    getTemplateList(): ITemplateItem[] {
        return this.config.templateList || []
    }

    // 添加模板列表项
    addTemplateItem(item: ITemplateItem) {
        if (!this.config.templateList) {
            this.config.templateList = []
        }
        this.config.templateList.push(item)
        this.saveConfig()
    }

    // 删除模板列表项
    delTemplateItem(index: number) {
        if (!this.config.templateList) {
            return
        }
        this.config.templateList.splice(index, 1)
        this.saveConfig()
    }

    // 修改模板列表项
    updateTemplateItem(index: number, item: ITemplateItem) {
        if (!this.config.templateList) {
            return
        }
        this.config.templateList[index] = item
        this.saveConfig()
    }

    // 清空模板列表
    resetTemplateList() {
        this.config.templateList = []
        this.saveConfig()
    }

    // TODO 恢复默认配置
}

export const configManagerInstance = new ConfigManager()
