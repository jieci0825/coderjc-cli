/** 操作分发器 —— 按固定顺序调度所有操作执行器 */
import type { TransformResult } from '../core/types'
import { runRegionRemove } from './region-remove'
import { runDelete } from './delete'
import { runRename } from './rename'
import { runJson } from './json'
import { runDeps } from './deps'
import { runClean } from './clean'

export function applyOperations(
    tempDir: string,
    result: TransformResult,
): void {
    // 处理文件相关操作
    if (result.operations) {
        for (const op of result.operations) {
            switch (op.action) {
                case 'region-remove':
                    runRegionRemove(tempDir, op.region)
                    break
                case 'delete':
                    runDelete(tempDir, op.pattern)
                    break
                case 'rename':
                    runRename(tempDir, op.from, op.to)
                    break
            }
        }
    }

    // 处理任意 JSON 文件 | 字段级增删改（点路径寻址 + 深度合并）
    if (result.json) {
        for (const op of result.json) {
            runJson(tempDir, op)
        }
    }

    // package.json | 增删 dependencies / devDependencies
    if (result.deps) {
        runDeps(tempDir, result.deps)
    }

    runClean(tempDir)
}
