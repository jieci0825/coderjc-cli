import { checkTemplateOrigin, validateProjectName } from '@/utils'
import chalk from 'chalk'

export default async function createCommand(projectName: string) {
    try {
        const validResult = validateProjectName(projectName)
        if (!validResult.valid) {
            console.log(chalk.redBright(`项目名称不符合规范: ${validResult.message}`))
            return
        }

        const origin = await checkTemplateOrigin()

        process.exit(0)
    } catch (error) {
        console.log(chalk.redBright(error))
        process.exit(1)
    }
}
