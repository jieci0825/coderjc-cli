import chalk, { ChalkInstance } from 'chalk'
import { ForegroundColorName, BackgroundColorName } from 'chalk/source/vendor/ansi-styles'
import { isArray, isString } from './check-type'

function isForegroundColorName(color: string): color is ForegroundColorName {
    return [
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
        'gray',
        'blackBright',
        'redBright',
        'greenBright',
        'yellowBright',
        'blueBright',
        'cyanBright',
        'magentaBright',
        'whiteBright'
    ].includes(color)
}

function isBackgroundColorName(color: string): color is BackgroundColorName {
    return [
        'bgBlack',
        'bgRed',
        'bgGreen',
        'bgYellow',
        'bgBlue',
        'bgCyan',
        'bgMagenta',
        'bgWhite',
        'bgGray',
        'bgGrey',
        'bgBlackBright',
        'bgRedBright',
        'bgGreenBright',
        'bgYellowBright',
        'bgBlueBright',
        'bgCyanBright',
        'bgMagentaBright',
        'bgWhiteBright'
    ].includes(color)
}

export type MessageType = 'info' | 'primary' | 'success' | 'warn' | 'error'

export type MessageTypeOptions = {
    bold?: boolean
    underline?: boolean
    color?: ForegroundColorName | null
    bgColor?: BackgroundColorName | null
}

export function info(message: string, opt: MessageTypeOptions = {}, isLog: boolean = true) {
    const mb = new MessageBuilder(message, { ...opt, color: 'grey' })
    return mb.build(isLog)
}

export function primary(message: string, opt: MessageTypeOptions = {}, isLog: boolean = true) {
    const mb = new MessageBuilder(message, { ...opt, color: 'blue' })
    return mb.build(isLog)
}

export function success(message: string, opt: MessageTypeOptions = {}, isLog: boolean = true) {
    const mb = new MessageBuilder(message, { ...opt, color: 'green' })
    return mb.build(isLog)
}

export function danger(message: string, opt: MessageTypeOptions = {}, isLog: boolean = true) {
    const mb = new MessageBuilder(message, { ...opt, color: 'red' })
    return mb.build(isLog)
}

class MessageBuilder {
    private message: string
    private options: MessageTypeOptions

    constructor(message: string, options: MessageTypeOptions) {
        this.message = message
        this.options = normalizeOptions(options)
    }

    bold(enable: boolean = true) {
        this.options.bold = enable
        return this
    }

    underline(enable: boolean = true) {
        this.options.underline = enable
        return this
    }

    build(isLog: boolean = true) {
        const optList = Object.entries(this.options) as [[key: keyof MessageTypeOptions, value: any]]

        const result = optList.reduce((acc: ChalkInstance, [key, value]) => {
            if (!value) return acc

            // color 和 bgColor单独处理
            if (key === 'color') {
                // 检测是否是一个有效的颜色值
                if (processColor(value) === 'rgb') {
                    const rgbValue = value as [number, number, number]
                    return acc.rgb(...rgbValue)
                } else if (processColor(value) === 'hex') {
                    return acc.hex(value as string)
                } else {
                    return isForegroundColorName(value) ? acc[value] : acc
                }
            }

            if (key === 'bgColor') {
                return isBackgroundColorName(value) ? acc[value] : acc
            }

            return acc[key]
        }, chalk)

        return isLog ? console.log(result(this.message)) : result(this.message)
    }
}

function normalizeOptions(opt: MessageTypeOptions) {
    return {
        bold: opt.bold || false,
        underline: opt.underline || false,
        color: opt.color || null,
        bgColor: opt.bgColor || null
    }
}

/**
 * 颜色值处理工具函数
 * @param color 颜色值，可以是 RGB 数组、十六进制字符串或颜色名称
 * @returns 处理后的颜色字符串
 */
function processColor(color: number[] | string): 'rgb' | 'hex' | ForegroundColorName {
    // 处理 RGB 数组情况
    if (isArray(color)) {
        if (color.length !== 3) {
            throw new Error('RGB 颜色值必须是包含 3 个数字的数组')
        }

        // 验证每个值是否在 0-255 范围内
        if (color.some(c => c < 0 || c > 255)) {
            throw new Error('RGB 值必须在 0-255 范围内')
        }

        return 'rgb'
    }

    // 处理十六进制颜色值
    if (isString(color)) {
        // 检查是否是十六进制格式
        if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
            return 'hex'
        }

        // 其余情况返回颜色值
        if (isForegroundColorName(color)) {
            return color
        }
    }

    throw new Error('无效的颜色值')
}
