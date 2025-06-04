/**
 * 日志相关类型定义
 */

import { ForegroundColorName, BackgroundColorName } from 'chalk/source/vendor/ansi-styles'

// 消息类型枚举
export type MessageType = 'info' | 'primary' | 'success' | 'warn' | 'error'

// 消息类型选项
export interface IMessageTypeOptions {
    bold?: boolean
    underline?: boolean
    color?: ForegroundColorName | null
    bgColor?: BackgroundColorName | null
}

// 颜色值类型
export type ColorValue = ForegroundColorName | [number, number, number] | string
