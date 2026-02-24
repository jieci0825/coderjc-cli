/** create 命令 —— 创建项目（流水线入口） */
import { Command } from 'commander'
import pc from 'picocolors'
import { runPipeline } from '../core/pipeline'

export function registerCreateCommand(program: Command): void {
    program
        .command('create <project-name>')
        .description('根据模板创建新项目')
        .action(async (projectName: string) => {
            try {
                await runPipeline(projectName)
            } catch (e) {
                console.error(pc.red((e as Error).message))
                process.exit(1)
            }
        })
}
