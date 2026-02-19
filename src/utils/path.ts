/** 路径常量 —— 缓存目录、配置文件路径等 */
import os from 'node:os'
import path from 'node:path'

const BASE_DIR = path.join(os.homedir(), '.coderjc')

export const CACHE_DIR = path.join(BASE_DIR, 'cache')
export const CONFIG_FILE = path.join(BASE_DIR, 'config.json')
