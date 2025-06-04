import { templateListQuestion } from '@/questions'
import { CreateActionContext } from '@/types'
import { checkTemplateOrigin, validateProjectName } from '@/utils'
import chalk from 'chalk'
import inquirer from 'inquirer'

// 创建行为上下文
function createActionContext(projectName: string) {
    const ctx: CreateActionContext = {
        projectName,
        originType: 'github',
        templateName: ''
    }

    return ctx
}

async function selectTemplate(ctx: CreateActionContext) {
    const result = await inquirer.prompt(templateListQuestion())
    ctx.templateName = result.templateName
}

export default async function createCommand(projectName: string, options: any) {
    // TODO 处理 options
    const ctx = createActionContext(projectName)

    try {
        const validResult = validateProjectName(projectName)
        if (!validResult.valid) {
            console.log(chalk.redBright(`项目名称不符合规范: ${validResult.message}`))
            return
        }

        const origin = await checkTemplateOrigin()
        ctx.originType = origin

        await selectTemplate(ctx)

        process.exit(0)
    } catch (error) {
        console.log(chalk.redBright(error))
        process.exit(1)
    }
}
