import { configManagerInstance, danger, primary } from '@/utils'

// 显示默认源
function showDefaultOrigin() {
    primary(`默认源：${configManagerInstance.getDefaultOrigin()}`)
}

export function getConfigCommand(key?: string) {
    try {
        if (key) {
            // 获取指定的配置
            if (key === 'default-origin' || key === 'do') {
                showDefaultOrigin()
            }
        } else {
            // 显示所有配置
            showDefaultOrigin()
        }
    } catch (error: any) {
        danger('获取配置失败：', error.message)
    }
}
