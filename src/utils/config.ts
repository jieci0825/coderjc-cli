/** 用户配置管理 —— 读写 ~/.cjc-cli/config.json */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { CONFIG_FILE } from './path'

export interface ConfigKeyDef {
    key: string
    description: string
}

export const CONFIG_KEYS: ConfigKeyDef[] = [
    { key: 'registry', description: '模板仓库地址' },
]

type Config = Record<string, string>

function loadConfig(): Config {
    if (!existsSync(CONFIG_FILE)) return {}
    try {
        return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
    } catch {
        return {}
    }
}

function saveConfig(config: Config): void {
    mkdirSync(path.dirname(CONFIG_FILE), { recursive: true })
    writeFileSync(
        CONFIG_FILE,
        JSON.stringify(config, null, 2) + '\n',
        'utf-8',
    )
}

export function getConfigValue(key: string): string | undefined {
    return loadConfig()[key]
}

export function setConfigValue(key: string, value: string): void {
    const config = loadConfig()
    config[key] = value
    saveConfig(config)
}

export function listConfig(): Config {
    return loadConfig()
}
