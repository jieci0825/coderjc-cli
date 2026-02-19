/** list 命令 —— 列出所有可用模板 */
import { Command } from 'commander'
import pc from 'picocolors'
import { readTemplates } from '../utils/cache'

export function registerListCommand(program: Command): void {
    program
        .command('list')
        .description('列出所有可用模板')
        .action(() => {
            try {
                const templates = readTemplates()
                if (templates.length === 0) {
                    console.log(pc.yellow('暂无可用模板'))
                    return
                }
                console.log(pc.bold('可用模板：\n'))
                for (const t of templates) {
                    console.log(
                        `  ${pc.cyan(t.name)}  ${pc.dim(t.description)}`,
                    )
                }
            } catch (e) {
                console.error(pc.red((e as Error).message))
                process.exit(1)
            }
        })
}
