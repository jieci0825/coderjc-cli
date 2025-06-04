import { TemplateOriginType } from '@/configs'
import { checkTemplateOrigin, validateProjectName } from '@/utils'
import chalk from 'chalk'

export type CreateActionContext = {
    projectName: string
    originType: TemplateOriginType
}

// 创建行为上下文
function createActionContext(projectName: string) {
    const ctx = {
        projectName,
        originType: 'github'
    }

    return ctx
}

export default async function createCommand(projectName: string, options: any) {
    console.log(options)

    try {
        const validResult = validateProjectName(projectName)
        if (!validResult.valid) {
            console.log(chalk.redBright(`项目名称不符合规范: ${validResult.message}`))
            return
        }

        // const origin = await checkTemplateOrigin()

        process.exit(0)
    } catch (error) {
        console.log(chalk.redBright(error))
        process.exit(1)
    }
}
