import { execa } from 'execa'

// 下载模板
export async function downloadTemplate() {
    if (origin === 'gitee') {
        // gitee 存在人机验证，所以直接执行 git clone 命令
        await execa('git', ['clone', `https://gitee.com/qwer-li/coderjc-template/${templateName}.git`, dest])
    }
}
