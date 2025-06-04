import { TemplateOriginType } from '@/configs'
import { execa } from 'execa'

// 下载模板
export async function downloadTemplate(templateName: string, origin: TemplateOriginType, dest: string) {
    if (origin === 'gitee') {
        // gitee 存在人机验证，所以直接执行 git clone 命令
        await execa('git', ['clone', `https://gitee.com/qwer-li/coderjc-template/${templateName}.git`, dest])
    }
}
