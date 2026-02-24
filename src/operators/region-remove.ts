/** 扫描所有文件，删除指定区域标记包裹的内容 */
import { readFileSync, writeFileSync } from 'node:fs'
import { scanTextFiles } from './scan'

const REGION_START = /#scaffold-start:(\S+)/
const REGION_END = /#scaffold-end:(\S+)/

export function runRegionRemove(tempDir: string, region: string): void {
    const files = scanTextFiles(tempDir)
    for (const file of files) {
        const content = readFileSync(file, 'utf-8')
        const result = removeRegion(content, region)
        if (result !== content) {
            writeFileSync(file, result, 'utf-8')
        }
    }
}

function removeRegion(content: string, region: string): string {
    const lines = content.split('\n')
    const output: string[] = []
    let depth = 0

    for (const line of lines) {
        // 匹配 #scaffold-start:region 标记
        //  - 开始的时候将深度 +1，让其区域内的代码在遍历过程中被跳过
        const startMatch = line.match(REGION_START)
        if (startMatch && startMatch[1] === region) {
            depth++
            continue
        }

        // 匹配 #scaffold-end:region 标记
        //  - 结束的时候将深度 -1，表示这个区域结束
        const endMatch = line.match(REGION_END)
        if (endMatch && endMatch[1] === region) {
            depth--
            continue
        }

        // 深度为 0 时，表示当前行不在任何区域中，直接添加到输出
        if (depth === 0) {
            output.push(line)
        }
    }

    return output.join('\n')
}
