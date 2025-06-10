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

    // TODO 替换掉原来 configs 下定义的 templateList 模块
    // 获取所有可选的模板列表
    getTemplateList(): ITemplateItem[] {
        return this.config.templateList || []
    }

    // 添加模板列表项

    // 删除模板列表项

    // 修改模板列表项

    // 重置模板列表

    // 恢复默认配置
}

export const configManagerInstance = new ConfigManager()
