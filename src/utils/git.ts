import { CreateActionContext } from '@/types'
import { execa } from 'execa'
import path from 'path'

// 下载模板
export async function downloadTemplate(ctx: CreateActionContext) {
    const dest = path.resolve(process.cwd(), ctx.projectName)

    // ! 这个 desc 这个目录是必须先创建，所以在下载模板之前，先创建目录，即处理 options

    if (ctx.originType === 'gitee') {
        // gitee 存在人机验证，所以直接执行 git clone 命令
        await execa('git', ['clone', `https://gitee.com/qwer-li/coderjc-template.git`, dest], {
            cwd: process.cwd()
        })
    }
}
