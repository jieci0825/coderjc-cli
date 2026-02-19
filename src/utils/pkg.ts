/** package.json 文件的读写工具 */
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * 读取 package.json 文件
 */
export function readPkg<T extends Record<string, unknown>>(filePath: string): T {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T
}

/**
 * 写入 package.json 文件
 */
export function writePkg(filePath: string, data: Record<string, unknown>): void {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}
