/** CLI 入口 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCli } from './cli.js'
import { usePkg } from './hooks/usePkg.js'

const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json')
const [getPkg] = usePkg(pkgPath)
const { version } = getPkg<{ version: string }>()

const program = createCli(version)
program.parse(process.argv)
