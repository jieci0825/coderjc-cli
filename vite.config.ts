import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        watch: {},
        target: 'es2015',
        outDir: 'bin',
        sourcemap: false,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'coderjc-cli',
            fileName(format, entryName) {
                return `${entryName}.js`
            },
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['node_modules/*'],
            plugins: []
        }
    }
})
