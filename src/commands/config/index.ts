import type { Command } from 'commander'
import { getCommand } from './get'
import { primary, success } from '@/utils'
import { keysCommand } from './keys'
import { setCommand } from './set'
import { delCommand } from './del'
import { clearCommand } from './clear'

export default function configCommand(program: Command) {
    const config = program.command('config').description('coderjc cli 配置管理')

    // cc config - 显示所有配置
    //  - 共用方法，不传递参数则显示所有配置
    config.action(() => getCommand())

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
        .action(getCommand)

    // cc config set <key> <value>
    config
        .command('set')
        .argument('<key>', '配置键名（template-list | tl | ...）')
        .argument('<value>', '配置值')
        .description('设置指定配置项，若这个配置项是数组类型，则<value>需要输入索引值')
        .action(setCommand)

    // cc config del <key>
    config.command('del').argument('<key>', '配置键名').description('暂无对应的行为实现').action(delCommand)

    // cc config clear <key>
    config
        .command('clear')
        .argument('<key>', '要清空的配置项')
        .description('清空配置项内容（保留字段结构）')
        .addHelpText(
            'after',
            `
危险操作警告:
  clear templateList  - 清空所有模板配置`
        )
        .action(clearCommand)
}
