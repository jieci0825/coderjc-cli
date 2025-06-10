import { Command } from 'commander'
import { readPackage } from 'read-pkg'
import { configCommand, createCommand, listCommand, mainCommand } from './commands'

async function init() {
    const pkg = await readPackage()

    const program = new Command()

    mainCommand(program, pkg)
    createCommand(program)
    listCommand(program)
    configCommand(program)

    // 参数少于2个时，显示帮助信息
    if (process.argv.length <= 2) {
        program.help()
    }

    program.parse()
}

init()
