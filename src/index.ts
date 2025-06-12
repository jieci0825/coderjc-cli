import { Command } from 'commander'
import { readPackage } from 'read-pkg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { configCommand, createCommand, listCommand, mainCommand, importCommand } from './commands'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function init() {
    const pkg = await readPackage({ cwd: join(__dirname, '..') })

    const program = new Command()

    mainCommand(program, pkg)
    createCommand(program)
    listCommand(program)
    configCommand(program)
    importCommand(program)

    // 参数少于2个时，显示帮助信息
    if (process.argv.length <= 2) {
        program.help()
    }

    program.parse()
}

init()
