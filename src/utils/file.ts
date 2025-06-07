import { existsSync, mkdirSync, rmSync, statSync } from 'fs'
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
