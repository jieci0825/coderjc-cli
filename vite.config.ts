import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// 递归获取 src 目录下的所有 .ts 文件
function getEntryPoints(dir: string, base: string = ''): Record<string, string> {
    const entries: Record<string, string> = {}
    const items = readdirSync(dir)

    for (const item of items) {
        const fullPath = join(dir, item)
        const relativePath = base ? join(base, item) : item

        if (statSync(fullPath).isDirectory()) {
            // 递归处理子目录
            Object.assign(entries, getEntryPoints(fullPath, relativePath))
        } else if (item.endsWith('.ts')) {
            // 处理 TypeScript 文件
            const entryName = relativePath.replace(/\.ts$/, '')
            entries[entryName] = fullPath
        }
    }

    return entries
}

export default defineConfig({
    build: {
        target: 'node16',
        outDir: 'lib',
        lib: {
            entry: ['src/index.ts'],
            formats: ['es']
        },
        rollupOptions: {
            external: [
                // Node.js 内置模块
                'fs',
                'path',
                'url',
                'util',
                'events',
                'stream',
                'buffer',
                'crypto',
                'os',
                'child_process',
                // 项目依赖
                'chalk',
                'commander',
                'fs-extra',
                'inquirer',
                'log-symbols',
                'ora',
                'simple-git',
                'validate-npm-package-name',
                'read-pkg'
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js'
            }
        },
        minify: false,
        sourcemap: false
    },
    esbuild: {
        target: 'node16'
    }
})
