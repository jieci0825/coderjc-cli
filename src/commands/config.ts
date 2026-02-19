/** config 命令 —— 管理用户配置（get / set / list） */
import { Command } from 'commander'
import pc from 'picocolors'
import {
    CONFIG_KEYS,
    getConfigValue,
    listConfig,
    setConfigValue,
} from '../utils/config'

export function registerConfigCommand(program: Command): void {
    const config = program.command('config').description('管理用户配置')

    for (const def of CONFIG_KEYS) {
        config
            .command(`${def.key} [value]`)
            .description(def.description)
            .action((value?: string) => {
                if (value === undefined) {
                    const current = getConfigValue(def.key)
                    if (current === undefined) {
                        console.log(pc.yellow(`${def.key} 未设置`))
                    } else {
                        console.log(`${def.key} = ${current}`)
                    }
                } else {
                    setConfigValue(def.key, value)
                    console.log(pc.green(`✔ ${def.key} = ${value}`))
                }
            })
    }

    config
        .command('list')
        .description('列出所有配置项')
        .action(() => {
            const all = listConfig()
            const entries = Object.entries(all)
            if (entries.length === 0) {
                console.log(pc.yellow('暂无配置项'))
                return
            }
            for (const [k, v] of entries) {
                console.log(`${k} = ${v}`)
            }
        })
}
