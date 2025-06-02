import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'bin',
    format: 'cjs',
    target: 'es2015',
    // banner: {
    //     js: '#!/usr/bin/env node'
    // },
    clean: true,
    treeshake: true,
    minify: false,
    noExternal: ['chalk']
})
