/** 解析 prompts.json 中的 prompts 定义 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { SCAFFOLD_DIR_NAME } from '../utils/path'
import type { Manifest } from '../core/types'

export function parseManifest(templateDir: string): Manifest {
    const promptsPath = path.join(
        templateDir,
        SCAFFOLD_DIR_NAME,
        'prompts.json',
    )
    return JSON.parse(readFileSync(promptsPath, 'utf-8'))
}
