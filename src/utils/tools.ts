import validateNpmPackageName from 'validate-npm-package-name'

// 检测是否是一个合法的项目名称
export function validateProjectName(name: string) {
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
            message: `项目名称不符合npm包名规范: ${messages.join(', ')}`
        }
    }

    // 检查是否包含非法字符（额外检查）
    const illegalChars = /[<>:"|?*\x00-\x1f\x80-\x9f]/
    if (illegalChars.test(name)) {
        return { valid: false, message: '项目名称包含非法字符' }
    }

    // 检查是否以点开头（隐藏文件）
    if (name.startsWith('.')) {
        return { valid: false, message: '项目名称不能以点(.)开头' }
    }

    return { valid: true }
}
