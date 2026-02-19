/** 注册所有 commander 子命令 */
import { Command } from 'commander'
import { registerCacheCommand } from './commands/cache'
import { registerConfigCommand } from './commands/config'
import { registerListCommand } from './commands/list'

export function createCli(version: string): Command {
    const program = new Command()

    program
        .name('coderjc')
        .description('根据模板配置进行动态交互、裁剪并输出项目')
        .version(version, '-v, --version')

    registerCacheCommand(program)
    registerConfigCommand(program)
    registerListCommand(program)

    return program
}
