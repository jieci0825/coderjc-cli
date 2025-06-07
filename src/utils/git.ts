import { CreateActionContext } from '@/types'
import { execa } from 'execa'
import ora from 'ora'
import { danger, primary, success } from './logger'
import download from 'download-git-repo'
import { readdirSync, statSync, renameSync, mkdirSync } from 'fs'
import { join } from 'path'
import { removeDir, removeFile, dirExists } from './file'

// 下载模板
export function downloadTemplate(ctx: CreateActionContext) {
    return new Promise<void>((resolve, reject) => {
        const spinner = ora(primary(`模板拉取中，请稍后...`, {}, false)).start()

        const url = {
            gitee: 'https://gitee.com/qwer-li/coderjc-template.git',
            github: 'https://github.com/jieci0825/coderjc-template.git'
        }

        execa('git', ['clone', url[ctx.originType], ctx.projectPath], {
            cwd: process.cwd()
        })
            .then(() => {
                spinner.succeed(success(`模板拉取成功`, {}, false))
                // 拉取模板成功之后，需要删除多余的文件
                removeExtraFiles(ctx)
                resolve()
            })
            .catch(() => {
                spinner.fail(danger(`模板拉取失败`, {}, false))
                reject('模板拉取失败')
            })
    })
}

function removeExtraFiles(ctx: CreateActionContext) {
    try {
        const spinner = ora(primary(`正在整理模板文件...`, {}, false)).start()

        // 读取项目目录下的所有文件和文件夹
        const items = readdirSync(ctx.projectPath)

        // 需要保留的目录名就是 templateName
        const keepDir = ctx.templateName
        const keepDirPath = join(ctx.projectPath, keepDir)

        // 检查目标模板目录是否存在
        if (!dirExists(keepDirPath)) {
            spinner.fail(danger(`模板目录不存在: ${keepDir}`, {}, false))
            return false
        }

        // 先将模板目录中的内容移动到临时目录
        const tempDirPath = join(ctx.projectPath, '__temp_template__')

        // 创建临时目录并移动模板内容
        mkdirSync(tempDirPath, { recursive: true })
        const templateItems = readdirSync(keepDirPath)
        templateItems.forEach(item => {
            const srcPath = join(keepDirPath, item)
            const destPath = join(tempDirPath, item)
            renameSync(srcPath, destPath)
        })

        // 删除所有原有的文件和目录（包括.git目录）
        //  - items 不是动态的，所以并没有记录创建的临时目录项，所以删除只会删除原有的文件和目录，不会删除临时目录
        items.forEach(item => {
            const itemPath = join(ctx.projectPath, item)
            const stat = statSync(itemPath)

            if (stat.isDirectory()) {
                removeDir(itemPath)
            } else {
                removeFile(itemPath)
            }
        })

        // 最后将临时目录中的内容移动到项目根目录
        const tempItems = readdirSync(tempDirPath)
        tempItems.forEach(item => {
            const srcPath = join(tempDirPath, item)
            const destPath = join(ctx.projectPath, item)
            renameSync(srcPath, destPath)
        })

        // 删除临时目录
        removeDir(tempDirPath)

        spinner.succeed(success(`模板文件整理完成`, {}, false))
        return true
    } catch (error) {
        console.error('删除多余文件时出错:', error)
        return false
    }
}
