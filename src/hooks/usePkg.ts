/** package.json 文件的读写钩子 */
import { readFileSync, writeFileSync } from 'node:fs'

export function usePkg(filePath: string) {
  const getPkg = <T extends Record<string, unknown> = Record<string, unknown>>(): T => {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T
  }

  const setPkg = (data: Record<string, unknown>): void => {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  }

  return [getPkg, setPkg] as const
}
