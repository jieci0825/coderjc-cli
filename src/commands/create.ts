import { isForceQuestion, templateListQuestion } from '@/questions'
import { CreateActionContext } from '@/types'
import { CreateCommandOptions } from '@/types/create-command'
import {
    danger,
    downloadTemplate,
    info,
    validateProjectName,
    dirExists,
    removeDir,
    createDir,
    success,
    readJsonFile,
    writeJsonFile,
    configManagerInstance
} from '@/utils'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'
import type { Command } from 'commander'

// 创建行为上下文
function createActionContext(projectName: string) {
    const ctx: CreateActionContext = {
        projectName,
        templateName: '',
        projectPath: path.resolve(process.cwd(), projectName),
        templateItem: null
    }

    return ctx
}

// 处理 options 之 template
function processOptionTemplate(ctx: CreateActionContext, options: CreateCommandOptions) {
    if (!options.template) return

    const isExist = configManagerInstance.hasTemplateItem(options.template)
    if (!isExist) {
        danger(`指定的模板 ${options.template} 不存在，请检查或不指定模板名称进行选择`)
        process.exit(0)
    }

    ctx.templateName = options.template
    // 同时赋值模板项
    const item = configManagerInstance.getTemplateItemByValue(options.template)
    ctx.templateItem = item
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
    // 如果指定了模板，则无需再选择
    if (ctx.templateName) {
        return
    }

    const result = await inquirer.prompt(templateListQuestion())
    ctx.templateName = result.templateName
    const item = configManagerInstance.getTemplateItemByValue(ctx.templateName)
    ctx.templateItem = item
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

    writeJsonFile(packageJsonPath, pkg, 4)

    spinner.succeed(success(`修改 ${ctx.projectName} 的 package.json 文件成功`, {}, false))
}

// 验证模板列表是否为空
function validateTemplateListEmpty(ctx: CreateActionContext) {
    const templateList = configManagerInstance.getTemplateList()
    if (!templateList || templateList.length === 0) {
        danger(`模板列表为空，请先添加模板`)
        process.exit(0)
    }
}

export async function createCommandAction(projectName: string, options: CreateCommandOptions) {
    const ctx = createActionContext(projectName)

    try {
        validateTemplateListEmpty(ctx)

        const validResult = validateProjectName(projectName)
        if (!validResult.valid) {
            danger(`项目名称不符合规范: ${validResult.message}`)
            return
        }

        await processOptions(ctx, options)
        await selectTemplate(ctx)
        await downloadTemplate(ctx)
        await modifyPackageJson(ctx)

        process.exit(0)
    } catch (error: any) {
        removeDir(ctx.projectPath)
        danger(error.message)
        process.exit(1)
    }
}

export default function createCommand(program: Command) {
    program
        .command('create')
        .argument('<project-name>', '创建的项目名称')
        .option('-f, --force', '强制覆盖已存在的项目目录')
        .option('-t, --template <template-name>', '指定项目模板')
        .description('创建一个项目')
        .action(createCommandAction)
}
