import { danger } from '@/utils'

export function getConfigCommand(key?: string) {
    try {
        if (key) {
            // 获取指定的配置
        } else {
            // 显示所有配置
        }
    } catch (error: any) {
        danger('获取配置失败：', error.message)
    }
}
