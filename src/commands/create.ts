import { checkTemplateExist } from '@/configs'
import { isForceQuestion, templateListQuestion } from '@/questions'
import { CreateActionContext } from '@/types'
import { CreateCommandOptions } from '@/types/create-command'
import {
    checkTemplateOrigin,
    danger,
    downloadTemplate,
    info,
    validateProjectName,
    dirExists,
    removeDir,
    createDir,
    success,
    readJsonFile,
    writeJsonFile
} from '@/utils'
import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

// 创建行为上下文
function createActionContext(projectName: string) {
    const ctx: CreateActionContext = {
        projectName,
        originType: 'github',
        templateName: '',
        projectPath: path.resolve(process.cwd(), projectName)
    }

    return ctx
}

// 处理 options 之 template
function processOptionTemplate(ctx: CreateActionContext, options: CreateCommandOptions) {
    if (!options.template) return

    const isExist = checkTemplateExist(options.template)
    if (!isExist) {
        danger(`指定的模板 ${options.template} 不存在，请检查或不指定模板名称进行选择`)
        process.exit(0)
    }

    ctx.templateName = options.template
}

// 处理 options 之 force
async function processOptionForce(ctx: CreateActionContext, options: CreateCommandOptions) {
    const isExist = dirExists(ctx.projectPath)

    // 如果目录不存，则无需处理，直接创建目录
    if (!isExist) {
        createDir(ctx.projectPath)
        return
    }

    function removeProjectDir() {
        const spinner = ora(info(`正在删除目录 ${ctx.projectName}，请稍后...`, {}, false)).start()
        const result = removeDir(ctx.projectPath)
        if (!result) {
            spinner.fail(info(`目录 ${ctx.projectName} 删除失败`, {}, false))
            process.exit(0)
        }
        spinner.succeed(success(`目录 ${ctx.projectName} 删除成功`, {}, false))
    }

    if (options.force) {
        removeProjectDir()
    } else {
        const { force: isForce } = await inquirer.prompt(isForceQuestion())
        if (!isForce) {
            info(`已取消创建项目 ${ctx.projectName}`)
            process.exit(0)
        }
        removeProjectDir()
    }

    // 覆盖删除后再创建目录
    createDir(ctx.projectPath)
}

// 处理 options
async function processOptions(ctx: CreateActionContext, options: CreateCommandOptions) {
    processOptionTemplate(ctx, options)
    await processOptionForce(ctx, options)
}

// 选择模板
async function selectTemplate(ctx: CreateActionContext) {
    if (ctx.templateName) return

    const result = await inquirer.prompt(templateListQuestion())
    ctx.templateName = result.templateName
}

// 修改模板 package.json 的内容
async function modifyPackageJson(ctx: CreateActionContext) {
    const spinner = ora(info(`正在修改 ${ctx.projectName} 的 package.json 文件`, {}, false)).start()

    const packageJsonPath = path.join(ctx.projectPath, 'package.json')

    const pkg = readJsonFile(packageJsonPath)
    if (!pkg) {
        spinner.fail(danger(`${ctx.projectName} 的 package.json 文件不存在`, {}, false))
        process.exit(0)
    }

    pkg.name = ctx.projectName

    writeJsonFile(packageJsonPath, pkg)

    spinner.succeed(success(`修改 ${ctx.projectName} 的 package.json 文件成功`, {}, false))
}

export default async function createCommand(projectName: string, options: CreateCommandOptions) {
    const ctx = createActionContext(projectName)

    try {
        const validResult = validateProjectName(projectName)
        if (!validResult.valid) {
            danger(`项目名称不符合规范: ${validResult.message}`)
            return
        }

        await processOptions(ctx, options)

        const origin = await checkTemplateOrigin()
        ctx.originType = origin

        await selectTemplate(ctx)
        await downloadTemplate(ctx)
        await modifyPackageJson(ctx)

        process.exit(0)
    } catch (error) {
        removeDir(ctx.projectPath)
        console.log(chalk.redBright(error))
        process.exit(1)
    }
}
