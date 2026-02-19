/** CLI 入口 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCli } from './cli'
import { readPkg } from './utils/pkg'

function main() {
    const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json')
    const { version } = readPkg<{ version: string }>(pkgPath)

    const program = createCli(version)
    program.parse(process.argv)
}

main()
