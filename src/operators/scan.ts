/** 扫描临时目录中的文本文件，排除 .scaffold 及二进制文件 */
import fg from 'fast-glob'
import { SCAFFOLD_DIR_NAME } from '../utils/path'

export function scanTextFiles(tempDir: string): string[] {
    return fg.sync('**/*', {
        cwd: tempDir,
        absolute: true,
        dot: true,
        onlyFiles: true,
        ignore: [
            `${SCAFFOLD_DIR_NAME}/**`,
            'node_modules/**',
            '**/*.{png,jpg,jpeg,gif,webp,ico,svg,woff,woff2,ttf,eot,mp4,mp3,zip,tar,gz,pdf}',
        ],
    })
}
