/** CLI 入口 */
import { createCli } from './cli'

function main() {
    const program = createCli(__PKG_VERSION__)
    program.parse(process.argv)
}

main()
