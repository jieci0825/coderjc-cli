import { TemplateOrigin, TemplateOriginType } from '@/configs'
import validateNpmPackageName from 'validate-npm-package-name'

// 检测是否是一个合法的项目名称
export function validateProjectName(name: string): { valid: boolean; message: string } {
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
    return new Promise((resolve, reject) => {
        // 记录最请求最先返回的时间
        let fastest = 0
        for (const key in TemplateOrigin) {
            const originKey = key as TemplateOriginType
            fetch(TemplateOrigin[originKey]).then(res => {
                if (fastest === 0) {
                    fastest = Date.now()
                    resolve(originKey)
                }
            })
        }
    })
}
