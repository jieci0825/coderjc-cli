import type { Command } from 'commander'

export default function configCommand(program: Command) {
    const config = program.command('config').description('coderjc cli 配置管理')

    // cc config
}
