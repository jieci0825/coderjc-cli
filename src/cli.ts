/** 注册所有 commander 子命令 */
import { Command } from 'commander'

export function createCli(version: string): Command {
    const program = new Command()

    program
        .name('coderjc')
        .description('按模板动态交互、裁剪并输出项目')
        .version(version, '-v, --version')

    return program
}
