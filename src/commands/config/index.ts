import type { Command } from 'commander'
import { getConfigCommand } from './get'

export default function configCommand(program: Command) {
    const config = program.command('config').description('coderjc cli 配置管理')

    // cc config - 显示所有配置
    //  - 共用方法，不传递参数则显示所有配置
    config.action(() => getConfigCommand())
}
