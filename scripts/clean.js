#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'node:path'

async function clean() {
    const libDir = path.join(import.meta.dirname, '../lib')

    try {
        await fs.remove(libDir)
        console.log('✅ 清理完成：已删除 lib 目录')
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('ℹ️  lib 目录不存在，无需清理')
        } else {
            console.error('❌ 清理失败:', error.message)
            process.exit(1)
        }
    }
}

clean()
