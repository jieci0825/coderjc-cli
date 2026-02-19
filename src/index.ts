/** CLI 入口 */
import { createRequire } from 'node:module'
import { createCli } from './cli.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json') as { version: string }

const program = createCli(pkg.version)
program.parse(process.argv)
