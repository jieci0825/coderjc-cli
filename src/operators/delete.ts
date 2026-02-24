/** 按 glob pattern 删除文件或目录 */
import { rmSync } from 'node:fs'
import fg from 'fast-glob'

export function runDelete(tempDir: string, pattern: string): void {
    const matches = fg.sync(pattern, {
        cwd: tempDir,
        absolute: true,
        onlyFiles: false,
        dot: true,
    })
    for (const match of matches) {
        rmSync(match, { recursive: true, force: true })
    }
}