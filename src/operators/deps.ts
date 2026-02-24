/** 读取 package.json，增删 dependencies / devDependencies */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { deepMerge } from './json'
import type { DepsOperation } from '../core/types'

export function runDeps(tempDir: string, op: DepsOperation): void {
    const pkgPath = path.resolve(tempDir, 'package.json')
    const raw = readFileSync(pkgPath, 'utf-8')
    let pkg = JSON.parse(raw) as Record<string, unknown>

    if (op.add) {
        pkg = deepMerge(pkg, { dependencies: op.add })
    }
    if (op.addDev) {
        pkg = deepMerge(pkg, { devDependencies: op.addDev })
    }

    if (op.remove?.length) {
        const deps = (pkg.dependencies ?? {}) as Record<string, string>
        for (const name of op.remove) {
            delete deps[name]
        }
        pkg.dependencies = deps
    }

    if (op.removeDev?.length) {
        const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>
        for (const name of op.removeDev) {
            delete devDeps[name]
        }
        pkg.devDependencies = devDeps
    }

    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
}