import { confirmItemQuestion } from '@/questions'
import { configManagerInstance, danger, info, validateConfigKey } from '@/utils'
import inquirer from 'inquirer'

export async function resetCommand(key?: string) {
    try {
        if (key) {
            const validResult = validateConfigKey(key)
            if (!validResult.valid) {
                danger(validResult.message)
                process.exit(0)
            }

            if (key === 'templateList' || key === 'tl') {
                configManagerInstance.resetConfig('templateList')
            }
        } else {
            const answer = await inquirer.prompt(
                confirmItemQuestion({ message: '你没有指定 key，所以将重置所有配置项，是否继续？' })
            )
            if (!answer.value) {
                info('已取消重置操作')
                process.exit(0)
            }

            configManagerInstance.resetConfig()
        }
    } catch (error: any) {
        danger('重置失败:', error.message)
        process.exit(0)
    }
}
