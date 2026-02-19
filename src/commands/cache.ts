/** cache 命令 —— 管理模板缓存（clean / update） */
import { Command } from 'commander'
import pc from 'picocolors'
import { cleanCache, updateCache } from '../utils/cache'

export function registerCacheCommand(program: Command): void {
    const cache = program.command('cache').description('管理模板缓存')

    cache
        .command('update')
        .description('拉取 / 更新远程模板仓库到本地缓存')
        .action(() => {
            try {
                updateCache()
                console.log(pc.green('✔ 模板缓存已更新'))
            } catch (e) {
                console.error(
                    pc.red((e as Error).message),
                )
                process.exit(1)
            }
        })

    cache
        .command('clean')
        .description('清除本地模板缓存')
        .action(() => {
            cleanCache()
            console.log(pc.green('✔ 模板缓存已清除'))
        })
}
