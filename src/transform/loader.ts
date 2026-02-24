/** 动态加载 transform.js，传入 config，返回 TransformResult */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { SCAFFOLD_DIR_NAME } from '../utils/path'
import type { TransformResult } from '../core/types'

export async function loadTransform(
    templateDir: string,
    config: Record<string, unknown>,
): Promise<TransformResult> {
    const transformPath = path.join(
        templateDir,
        SCAFFOLD_DIR_NAME,
        'transform.js',
    )
    const mod = await import(pathToFileURL(transformPath).href)
    const fn = mod.default ?? mod
    return fn(config)
}
