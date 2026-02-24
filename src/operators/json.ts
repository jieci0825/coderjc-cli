/** JSON 文件字段级增删改（点路径寻址 + 深度合并） */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { JsonOperation } from '../core/types'

export function runJson(tempDir: string, op: JsonOperation): void {
    const filePath = path.resolve(tempDir, op.file)
    const raw = readFileSync(filePath, 'utf-8')
    let data = JSON.parse(raw)

    if (op.removeFields) {
        for (const field of op.removeFields) {
            deleteByPath(data, field)
        }
    }

    if (op.merge) {
        data = deepMerge(data, op.merge)
    }

    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export function deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
): Record<string, unknown> {
    const result = { ...target }
    for (const key of Object.keys(source)) {
        const srcVal = source[key]
        const tgtVal = result[key]
        if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
            result[key] = deepMerge(
                tgtVal as Record<string, unknown>,
                srcVal as Record<string, unknown>,
            )
        } else {
            result[key] = srcVal
        }
    }
    return result
}

function deleteByPath(obj: Record<string, unknown>, dotPath: string): void {
    const keys = dotPath.split('.')
    let cur: Record<string, unknown> = obj
    for (let i = 0; i < keys.length - 1; i++) {
        const next = cur[keys[i]]
        if (!isPlainObject(next)) return
        cur = next as Record<string, unknown>
    }
    delete cur[keys[keys.length - 1]]
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val)
}