import { program } from 'commander'
import { readPackage } from 'read-pkg'
import { createCommand } from './commands'

async function init() {
    const pkg = await readPackage()

    program
        .name('cc')
        .description('一个从预设的 Git 仓库中拉取项目模板，并快速初始化项目目录的 CLI 工具')
        .version(pkg.version, '-v, --version', '输出当前版本号')

    program.command('create <project-name>').description('创建一个项目，需要输入项目名称').action(createCommand)

    if (process.argv.length <= 2) {
        program.help()
    }

    program.parse()
}

init()
