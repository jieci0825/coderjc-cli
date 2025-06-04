import { TemplateOrigin } from '@/configs'
import { IValidationResult } from '@/types/utils'
import validateNpmPackageName from 'validate-npm-package-name'
import ora from 'ora'
import { danger, info, success } from './logger'
import { TemplateOriginType } from '@/types'

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

// 检测 github 和 gitee 那个更快
export function checkTemplateOrigin(): Promise<TemplateOriginType> {
    const spinner = ora(info('正在检测模板源，请稍后...', {}, false)).start()
    return new Promise((resolve, reject) => {
        // 记录最请求最先返回的时间
        let fastest = 0
        for (const key in TemplateOrigin) {
            const originKey = key as TemplateOriginType
            fetch(TemplateOrigin[originKey])
                .then(res => {
                    if (fastest === 0) {
                        spinner.succeed(success(`检测到最快的模板源为：${originKey}`, {}, false))
                        fastest = Date.now()
                        resolve(originKey)
                    }
                })
                .catch(err => {
                    spinner.fail(danger('检测模板源失败', {}, false))
                    reject(err)
                })
        }
    })
}
