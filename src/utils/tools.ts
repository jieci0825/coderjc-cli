import { IValidationResult } from '@/types/utils'
import validateNpmPackageName from 'validate-npm-package-name'
import ora from 'ora'
import { danger, info, success } from './logger'
import { CONFIG_KEYS } from '@/constants'
import { IGlobalConfig } from '@/types'

// 检测是否是一个合法的项目名称
export function validateProjectName(name: string): IValidationResult {
    // 不能为空
    if (!name || name.trim() === '') {
        return { valid: false, message: '项目名称不能为空' }
    }

    // 检查是否是合法的npm包名规范
    const npmValidation = validateNpmPackageName(name)
    if (!npmValidation.validForNewPackages) {
        const errors = npmValidation.errors || []
        const warnings = npmValidation.warnings || []
        const messages = [...errors, ...warnings]
        return {
            valid: false,
            message: ` ${messages.join(', ')}`
        }
    }

    return { valid: true, message: '' }
}

// 检测最快的模板源
export function checkTemplateOrigin(list: string[]): Promise<string> {
    if (list.length === 0) {
        return Promise.reject('模板源列表不能为空')
    }
    if (list.length === 1) {
        return Promise.resolve(list[0])
    }
    const spinner = ora(info('正在检测模板源，请稍后...', {}, false)).start()
    return new Promise((resolve, reject) => {
        // 记录最请求最先返回的时间
        let fastest = 0
        for (const item of list) {
            fetch(item)
                .then(res => {
                    if (fastest === 0) {
                        spinner.succeed(success(`检测到最快的模板源为：${item}`, {}, false))
                        fastest = Date.now()
                        resolve(item)
                    }
                })
                .catch(err => {
                    spinner.fail(danger('检测模板源失败', {}, false))
                    reject(err)
                })
        }
    })
}

// 验证配置项目 key 是否合法
export function validateConfigKey(key: string): IValidationResult {
    if (!key || key.trim() === '') {
        return { valid: false, message: '配置项 key 不能为空' }
    }

    // 检测key是否是合法的 key
    const keys = CONFIG_KEYS.map(item => item.key)
    if (!keys.includes(key)) {
        return { valid: false, message: `配置项 ${key} 不合法` }
    }

    return { valid: true, message: '' }
}

// 验证模板列表格式
export function validateTemplateListFormat(data: any): data is IGlobalConfig {
    if (!data || typeof data !== 'object') {
        return false
    }

    if (!Array.isArray(data.templateList)) {
        return false
    }

    // 验证每个模板项的格式
    for (const item of data.templateList) {
        if (!item || typeof item !== 'object') {
            return false
        }

        if (
            typeof item.name !== 'string' ||
            typeof item.description !== 'string' ||
            typeof item.value !== 'string' ||
            typeof item.isStore !== 'boolean' ||
            !Array.isArray(item.originUrls)
        ) {
            return false
        }

        // 验证 originUrls 中的每个 URL 都是字符串
        if (!item.originUrls.every((url: any) => typeof url === 'string')) {
            return false
        }
    }

    return true
}
