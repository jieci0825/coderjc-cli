import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
    entry: ['src/index.ts'],
    format: 'esm',
    clean: true,
    banner: { js: '#!/usr/bin/env node' },
    // 将版本号在构建时替换为字符串字面量，避免运行时读取 package.json
    define: {
        __PKG_VERSION__: JSON.stringify(version),
    },
})
