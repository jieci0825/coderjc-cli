/** 清理所有文件中残留的 #scaffold 标记行 */
import { readFileSync, writeFileSync } from 'node:fs'
import { scanTextFiles } from './scan'

const SCAFFOLD_MARKER = /#scaffold-(start|end):\S+/

export function runClean(tempDir: string): void {
    const files = scanTextFiles(tempDir)
    for (const file of files) {
        const content = readFileSync(file, 'utf-8')
        const lines = content.split('\n')
        const cleaned = lines.filter((line) => !SCAFFOLD_MARKER.test(line))
        if (cleaned.length !== lines.length) {
            writeFileSync(file, cleaned.join('\n'), 'utf-8')
        }
    }
}