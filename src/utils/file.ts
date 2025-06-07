import { existsSync, mkdirSync, rmSync, statSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'

/**
 * 检测一个文件是否存在
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export function fileExists(filePath: string): boolean {
    try {
        return existsSync(filePath) && statSync(filePath).isFile()
    } catch {
        return false
    }
}

/**
 * 检测一个目录是否存在
 * @param dirPath 目录路径
 * @returns 目录是否存在
 */
export function dirExists(dirPath: string): boolean {
    try {
        return existsSync(dirPath) && statSync(dirPath).isDirectory()
    } catch {
        return false
    }
}

/**
 * 创建一个目录
 * @param dirPath 目录路径
 * @param recursive 是否递归创建父目录，默认为true
 * @returns 是否创建成功
 */
export function createDir(dirPath: string, recursive: boolean = true): boolean {
    try {
        if (!dirExists(dirPath)) {
            mkdirSync(dirPath, { recursive })
            return true
        }
        return true // 目录已存在
    } catch (error) {
        console.error('创建目录失败:', error)
        return false
    }
}

/**
 * 删除一个目录
 * @param dirPath 目录路径
 * @param recursive 是否递归删除，默认为true
 * @returns 是否删除成功
 */
export function removeDir(dirPath: string, recursive: boolean = true): boolean {
    try {
        if (dirExists(dirPath)) {
            rmSync(dirPath, { recursive, force: true })
            return true
        }
        return true // 目录不存在，视为删除成功
    } catch (error) {
        console.error('删除目录失败:', error)
        return false
    }
}

/**
 * 删除一个文件
 * @param filePath 文件路径
 * @returns 是否删除成功
 */
export function removeFile(filePath: string): boolean {
    try {
        if (fileExists(filePath)) {
            rmSync(filePath, { force: true })
            return true
        }
        return true // 文件不存在，视为删除成功
    } catch (error) {
        console.error('删除文件失败:', error)
        return false
    }
}

/**
 * 确保文件所在的目录存在
 * @param filePath 文件路径
 * @returns 是否成功
 */
export function ensureDir(filePath: string): boolean {
    const dir = dirname(filePath)
    return createDir(dir)
}

/**
 * 获取文件或目录的统计信息
 * @param path 路径
 * @returns 统计信息或null
 */
export function getStats(path: string) {
    try {
        return statSync(path)
    } catch {
        return null
    }
}

// 读取json文件数据
/**
 * 读取JSON文件数据
 * @param filePath JSON文件路径
 * @returns 解析后的JSON数据，如果失败返回null
 */
export function readJsonFile<T = any>(filePath: string): T | null {
    try {
        if (!fileExists(filePath)) {
            console.error('JSON文件不存在:', filePath)
            return null
        }

        const content = readFileSync(filePath, 'utf-8')
        return JSON.parse(content) as T
    } catch (error) {
        console.error('读取JSON文件失败:', error)
        return null
    }
}

/**
 * 写入JSON文件数据
 * @param filePath JSON文件路径
 * @param data 要写入的数据对象
 * @param indent 缩进空格数，默认为2，传入0则不格式化
 * @returns 是否写入成功
 */
export function writeJsonFile<T = any>(filePath: string, data: T, indent: number = 2): boolean {
    try {
        // 确保目录存在
        if (!ensureDir(filePath)) {
            console.error('创建目录失败:', filePath)
            return false
        }

        // 将数据序列化为JSON字符串
        const jsonString = JSON.stringify(data, null, indent)

        // 写入文件
        writeFileSync(filePath, jsonString, 'utf-8')
        return true
    } catch (error) {
        console.error('写入JSON文件失败:', error)
        return false
    }
}
