/** 冲突检测、确认覆盖、清理 .scaffold 目录 */
import { existsSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import { SCAFFOLD_DIR_NAME } from '../utils/path'

export async function checkTargetDir(targetDir: string): Promise<void> {
    if (!existsSync(targetDir) || isEmpty(targetDir)) return

    const dirName = path.basename(targetDir)
    const action = await p.select({
        message: `目标目录 "${dirName}" 已存在且不为空，请选择操作：`,
        options: [
            { label: '取消操作', value: 'cancel' },
            { label: '清空目录后继续', value: 'overwrite' },
            { label: '忽略已有文件，直接继续', value: 'ignore' },
        ],
    })

    if (p.isCancel(action) || action === 'cancel') {
        p.cancel('操作已取消')
        process.exit(0)
    }

    if (action === 'overwrite') {
        emptyDir(targetDir)
    }
}

export function cleanScaffold(targetDir: string): void {
    const scaffoldDir = path.join(targetDir, SCAFFOLD_DIR_NAME)
    if (existsSync(scaffoldDir)) {
        rmSync(scaffoldDir, { recursive: true, force: true })
    }
}

function isEmpty(dir: string): boolean {
    const files = readdirSync(dir)
    return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir: string): void {
    for (const file of readdirSync(dir)) {
        if (file === '.git') continue
        rmSync(path.resolve(dir, file), { recursive: true, force: true })
    }
}
