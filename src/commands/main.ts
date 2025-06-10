import type { Command } from 'commander'

export default function mainCommand(program: Command, pkg: any) {
    program
        .name('cc')
        .description('一个从预设的 Git 仓库中拉取项目模板，并快速初始化项目目录的 CLI 工具。需要 node 版本 >= 18.0.0')
        .version(pkg.version, '-v, --version', '输出当前版本号')
}
