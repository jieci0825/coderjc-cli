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
    validateTemplateListFormat,
    isDir,
    createDir
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
        .option('--file <path>', '从 JSON 文件导入模板配置（每次执行都是重新创建模板列表，合并需使用 --merge）')
        .option('--gits <url>', '从 git 模板仓库导入多个模板（每次执行都是重新创建模板列表，合并需使用 --merge）')
        .option('--git <url>', '从 git 仓库导入单个模板（同 value 默认覆盖，不支持 --merge）')
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

    const spinner = ora(primary(`开始导入...`, {}, false)).start()

    const dest = path.join(process.cwd(), '__coderjc-template-store__')

    // 如果出现同名临时目录，则退出，并提示用户
    if (dirExists(dest)) {
        danger(`临时目录已存在，无法执行导入操作: ${dest}`)
        process.exit(0)
    }

    try {
        // 提前创建临时目录
        createDir(dest)

        if (file) {
            await importFromJsonFile(file, { merge })
        } else if (gits) {
            await importFromGitStore(gits, dest, { merge })
        } else if (git) {
            await importFromGitTemplate(git, dest, { merge })
        }
        spinner.succeed(success(`导入成功`, {}, false))
    } catch (error: any) {
        spinner.fail(danger(`导入失败: ${error.message}`, {}, false))
    } finally {
        // 移除临时目录
        removeDir(dest)
        process.exit(0)
    }
}

// 从 JSON 文件导入
async function importFromJsonFile(filePath: string, options: { merge?: boolean } = {}) {
    // 处理相对路径和绝对路径
    let resolvedPath: string
    if (isAbsolute(filePath)) {
        resolvedPath = filePath
    } else {
        resolvedPath = resolve(process.cwd(), filePath)
    }

    info(`\n组装的 JSON 文件路径: ${resolvedPath}`)

    if (!fileExists(resolvedPath)) {
        danger(`JSON 文件不存在: ${resolvedPath}`)
        process.exit(0)
    }

    // 读取并验证 JSON 文件
    const jsonData = readJsonFile<IGlobalConfig>(resolvedPath)
    if (!jsonData) {
        danger('读取失败')
        process.exit(0)
    }

    // 验证数据格式
    if (!validateTemplateListFormat(jsonData)) {
        danger('JSON 文件格式不正确，必须包含有效的 templateList 字段')
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
        return
    }

    // 如果不是合并模式，则直接删除原有的模板项，并添加新的模板项
    info('使用替换模式导入配置')

    // 清空原有的所有模板项
    configManagerInstance.clearTemplateList()
    info('已经清空原有模板项')

    // 替换原模板列表
    configManagerInstance.setTemplateList(templateList)
    success(`替换模式：成功导入 ${templateList.length} 个模板项`)
}

// 从 git 模板仓库导入（包含多个模板）
async function importFromGitStore(gitUrl: string, dest: string, options: { merge?: boolean } = {}) {
    return new Promise<void>((resolve, reject) => {
        const dirList: any[] = []
        execa('git', ['clone', gitUrl, dest], { cwd: process.cwd() })
            .then(() => {
                // 读取项目目录下的所有文件和文件夹
                const items = readdirSync(dest)
                items.forEach(item => {
                    // 判断是否是文件夹
                    const target = path.join(dest, item)
                    if (isDir(target)) {
                        dirList.push({
                            name: item,
                            value: item,
                            description: '',
                            isStore: true,
                            originUrls: [gitUrl],
                            url: target
                        })
                    }
                })

                // 遍历文件夹，读取每个文件夹下的 package.json 文件
                for (const dir of dirList) {
                    const packageJsonPath = path.join(dir.url, 'package.json')
                    if (fileExists(packageJsonPath)) {
                        const packageJson = readJsonFile<any>(packageJsonPath)
                        if (packageJson) {
                            dir.description = packageJson.description || '[无描述]'
                        }
                    }
                }

                const templateList: ITemplateItem[] = dirList.map(item => {
                    return {
                        name: item.name,
                        value: item.value,
                        description: item.description,
                        isStore: item.isStore,
                        originUrls: item.originUrls
                    }
                })

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
                    return
                }

                // 如果不是合并模式，则直接删除原有的模板项，并添加新的模板项
                // 清空原有的所有模板项
                configManagerInstance.clearTemplateList()
                info('已经清空原有模板项')

                // 替换原模板列表
                configManagerInstance.setTemplateList(templateList)
                success(`替换模式：成功导入 ${templateList.length} 个模板项`)

                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}

// 从 git 仓库导入单个模板
async function importFromGitTemplate(gitUrl: string, dest: string, options: { merge?: boolean } = {}) {
    return new Promise<void>((resolve, reject) => {
        execa('git', ['clone', gitUrl, dest], { cwd: process.cwd() })
            .then(() => {
                const packageJsonPath = path.join(dest, 'package.json')
                if (fileExists(packageJsonPath)) {
                    const packageJson = readJsonFile<any>(packageJsonPath)
                    if (packageJson) {
                        if (!packageJson.name) {
                            info('package.json 中没有 name 字段，使用时间戳代替')
                        }

                        const name = packageJson.name || new Date().getTime().toString()

                        const data: ITemplateItem = {
                            name,
                            value: name,
                            description: packageJson.description || '[无描述]',
                            isStore: false,
                            originUrls: [gitUrl]
                        }

                        if (configManagerInstance.hasTemplateItem(name)) {
                            info('\n--git 导入时模板已存在，本次导入跳过')
                        } else {
                            configManagerInstance.addTemplateItem(data)
                            success(`\n--git 导入成功：${name}`)
                        }
                        resolve()
                    }
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}
