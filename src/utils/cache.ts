/** 缓存管理 —— git clone / pull / clean / 读取模板 */
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { CACHE_DIR } from './path'
import { getConfigValue } from './config'
import type { TemplateInfo } from '../core/types'

function getRegistry(): string {
    const registry = getConfigValue('registry')
    if (!registry) {
        throw new Error(
            '模板仓库地址未配置，请先执行: coderjc config registry <url>',
        )
    }
    return registry
}

export function updateCache(): void {
    const registry = getRegistry()

    if (existsSync(path.join(CACHE_DIR, '.git'))) {
        execSync('git pull', { cwd: CACHE_DIR, stdio: 'inherit' })
    } else {
        execSync(`git clone "${registry}" "${CACHE_DIR}"`, {
            stdio: 'inherit',
        })
    }
}

export function cleanCache(): void {
    if (!existsSync(CACHE_DIR)) return
    rmSync(CACHE_DIR, { recursive: true, force: true })
}

export function readTemplates(): TemplateInfo[] {
    const templatesPath = path.join(CACHE_DIR, 'templates.json')
    if (!existsSync(templatesPath)) {
        throw new Error(
            '模板列表不存在，请先执行: coderjc cache update',
        )
    }
    const data = JSON.parse(readFileSync(templatesPath, 'utf-8'))
    return data.templates
}
