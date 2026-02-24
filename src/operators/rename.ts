/** 按规则重命名文件 */
import { mkdirSync, renameSync } from 'node:fs'
import path from 'node:path'

export function runRename(tempDir: string, from: string, to: string): void {
    const src = path.resolve(tempDir, from)
    const dest = path.resolve(tempDir, to)
    mkdirSync(path.dirname(dest), { recursive: true })
    renameSync(src, dest)
}