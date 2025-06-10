import type { Command } from 'commander'

export default function listCommand(program: Command) {
    program
        .command('list')
        .description('查看所有可用的项目模板')
        .action(() => {})
}
