import type { Command } from 'commander'
import { getConfigCommand } from './get'
import { primary, success } from '@/utils'
import { keysCommand } from './keys'

export default function configCommand(program: Command) {
    const config = program.command('config').description('coderjc cli 配置管理')

    // cc config - 显示所有配置
    //  - 共用方法，不传递参数则显示所有配置
    config.action(() => getConfigCommand())

    // cc config keys
    config.command('keys').description('查看所有支持的配置项 key').action(keysCommand)

    // cc config get <key>
    config
        .command('get')
        .argument('<key>', '配置键名（template-list | tl | ...）')
        .description('获取指定配置项')
        .addHelpText(
            'after',
            `详细的配置项，可以执行命令 ${primary(
                'cc config keys',
                { underline: true, bold: true },
                false
            )} 或阅读文档: ${success('https://github.com/coderjc/coderjc-cli', { underline: true, bold: true }, false)}`
        )
        .action(getConfigCommand)
}
