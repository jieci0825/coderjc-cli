import { CreateActionContext } from '@/types'
import { execa } from 'execa'
import ora from 'ora'
import { danger, primary, success } from './logger'
import download from 'download-git-repo'

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
                resolve()
            })
            .catch(() => {
                spinner.fail(danger(`模板拉取失败`, {}, false))
                reject()
                process.exit(0)
            })
    })
}
