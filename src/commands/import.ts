import type { Command } from 'commander'
import {
    readJsonFile,
    fileExists,
    removeDir,
    dirExists,
    configManagerInstance,
    danger,
    info,
    success,
    primary,
    validateTemplateListFormat
} from '@/utils'
import { ITemplateItem, IGlobalConfig } from '@/types'
import { execa } from 'execa'
import ora from 'ora'
import path from 'path'
import { readdirSync } from 'fs'
import { isAbsolute, resolve } from 'path'

export default function importCommand(program: Command) {
    program
        .command('import')
        .description('导入模板配置')
        .option('--file <path>', '从 JSON 文件导入模板配置')
        .option('--gits <url>', '从 git 模板仓库导入多个模板')
        .option('--git <url>', '从 git 仓库导入单个模板')
        .option('--merge', '与现有配置合并（同 value 的会跳过）')
        .action(importCommandAction)
}

async function importCommandAction(options: { file?: string; gits?: string; git?: string; merge?: boolean }) {
    const { file, gits, git, merge } = options

    // 检查参数
    const optionCount = [file, gits, git].filter(Boolean).length
    if (optionCount !== 1) {
        danger('请指定一个导入方式：--file、--gits 或 --git')
        return
    }

    try {
        if (file) {
            await importFromJsonFile(file, { merge })
        } else if (gits) {
            await importFromGitStore(gits, { merge })
        } else if (git) {
            await importFromGitTemplate(git, { merge })
        }
    } catch (error: any) {
        danger(`导入失败: ${error.message}`)
    } finally {
        process.exit(0)
    }
}

// 从 JSON 文件导入
async function importFromJsonFile(filePath: string, options: { merge?: boolean } = {}) {
    const spinner = ora(primary(`开始从 JSON 文件导入模板配置...`, {}, false)).start()

    // 处理相对路径和绝对路径
    let resolvedPath: string
    if (isAbsolute(filePath)) {
        resolvedPath = filePath
    } else {
        resolvedPath = resolve(process.cwd(), filePath)
    }

    info(`\n组装的 JSON 文件路径: ${resolvedPath}`)

    if (!fileExists(resolvedPath)) {
        spinner.fail(danger(`JSON 文件不存在: ${resolvedPath}`, {}, false))
        process.exit(0)
    }

    // 读取并验证 JSON 文件
    const jsonData = readJsonFile<IGlobalConfig>(resolvedPath)
    if (!jsonData) {
        spinner.fail(danger('读取失败', {}, false))
        process.exit(0)
    }

    // 验证数据格式
    if (!validateTemplateListFormat(jsonData)) {
        spinner.fail(danger('JSON 文件格式不正确，必须包含有效的 templateList 字段', {}, false))
        process.exit(0)
    }

    const templateList = jsonData.templateList || []

    // 如果是合并模式，直接合并所有配置
    if (options.merge) {
        info('使用合并模式导入配置，合并模式下相同 value 的会被跳过...')
        let addedCount = 0
        templateList.forEach(item => {
            if (!configManagerInstance.hasTemplateItem(item.value)) {
                configManagerInstance.addTemplateItem(item)
                addedCount++
            }
        })

        success(`合并模式：成功导入 ${addedCount} 个新模板项`)
        process.exit(0)
    }

    // 如果不是合并模式，则直接删除原有的模板项，并添加新的模板项
    info('使用替换模式导入配置')

    // 清空原有的所有模板项
    configManagerInstance.clearTemplateList()
    info('已经清空原有模板项')

    // 替换原模板列表
    configManagerInstance.setTemplateList(templateList)

    success(`替换模式：成功导入 ${templateList.length} 个模板项`)

    spinner.succeed(success('JSON 文件导入完成', {}, false))
}

// 从 git 模板仓库导入（包含多个模板）
async function importFromGitStore(gitUrl: string, options: { merge?: boolean } = {}) {}

// 从 git 仓库导入单个模板
async function importFromGitTemplate(gitUrl: string, options: { merge?: boolean } = {}) {}
