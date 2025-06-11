import { IGlobalConfig, ITemplateItem, TemplateOriginType } from '@/types'
import path from 'path'
import { readJsonFile, writeJsonFile } from './file'
import { danger } from './logger'

export class ConfigManager {
    private configPath: string
    config: IGlobalConfig

    constructor() {
        this.configPath = path.join(import.meta.dirname, '..', 'global-config.json')
        this.config = this.loadConfig(false)
    }

    // 加载配置
    private loadConfig(isForce: boolean = true) {
        const config = readJsonFile<IGlobalConfig>(this.configPath)!
        if (isForce) {
            this.config = config
        }
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

    // 获取所有可选的模板列表
    getTemplateList(): ITemplateItem[] {
        return this.config.templateList || []
    }

    // 根据传入的 value 判断当前模板项是否存在
    hasTemplateItem(value: string): boolean {
        if (!this.config.templateList || this.config.templateList.length === 0) {
            return false
        }
        return this.config.templateList.some(item => item.value === value)
    }

    // 根据 value 获取模板列表项
    getTemplateItemByValue(value: string): ITemplateItem | null {
        if (!this.config.templateList || this.config.templateList.length === 0) {
            return null
        }
        // console.log(this.config.templateList)
        return this.config.templateList.find(item => item.value === value) || null
    }

    // 获取指定索引的模板列表项
    getTemplateItem(index: number): ITemplateItem | null {
        if (!this.config.templateList || this.config.templateList.length === 0) {
            return null
        }
        return this.config.templateList[index] || null
    }

    // 添加模板列表项
    addTemplateItem(item: ITemplateItem) {
        if (!this.config.templateList) {
            this.config.templateList = []
        }
        this.config.templateList.push(item)
        this.saveConfig()
        this.loadConfig()
    }

    // 替换整个模板列表
    setTemplateList(list: ITemplateItem[]) {
        this.config.templateList = list
        this.saveConfig()
        this.loadConfig()
    }

    // 删除模板列表项
    delTemplateItem(index: number) {
        if (!this.config.templateList) {
            return
        }
        this.config.templateList.splice(index, 1)
        this.saveConfig()
        this.loadConfig()
    }

    // 修改模板列表项
    updateTemplateItem(index: number, item: ITemplateItem) {
        if (!this.config.templateList) {
            return
        }
        this.config.templateList[index] = item
        this.saveConfig()
        this.loadConfig()
    }

    // 清空模板列表
    clearTemplateList() {
        this.config.templateList = []
        this.saveConfig()
        this.loadConfig()
    }

    // 恢复默认配置
    resetConfig<K extends keyof IGlobalConfig>(key?: K) {
        const bakJsonPath = path.join(import.meta.dirname, '..', 'global-config.bak.json')
        const bakJson = readJsonFile<IGlobalConfig>(bakJsonPath)
        if (!bakJson) {
            danger('备份文件不存在, 无法恢复默认配置!!!')
            process.exit(0)
        }
        if (key) {
            this.config[key] = bakJson[key]
        } else {
            this.config = bakJson
        }
        this.saveConfig()
        this.loadConfig()
    }
}

export const configManagerInstance = new ConfigManager()
