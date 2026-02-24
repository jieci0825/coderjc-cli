/** 流水线调度器 —— 按阶段顺序驱动执行 */
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { readTemplates } from '../utils/cache'
import { CACHE_DIR } from '../utils/path'
import { parseManifest } from '../prompt/parser'
import { runPrompts } from '../prompt/runner'
import { loadTransform } from '../transform/loader'
import { applyOperations } from '../operators'
import { checkTargetDir, cleanScaffold } from '../output/output'
import type { PipelineContext } from './context'

export async function runPipeline(
    projectName: string,
): Promise<PipelineContext> {
    p.intro(pc.cyan(`创建项目: ${projectName}`))

    if (!existsSync(CACHE_DIR)) {
        p.cancel('模板缓存不存在，请先执行: coderjc cache update')
        process.exit(1)
    }

    const targetDir = path.resolve(process.cwd(), projectName)

    await checkTargetDir(targetDir)

    const templates = readTemplates()
    const templateId = await p.select({
        message: '请选择模板',
        options: templates.map((t) => ({
            value: t.id,
            label: t.name,
            hint: t.description,
        })),
    })

    if (p.isCancel(templateId)) {
        p.cancel('操作已取消')
        process.exit(0)
    }

    const template = templates.find((t) => t.id === templateId)!
    const templateDir = path.join(CACHE_DIR, template.id)

    const manifest = parseManifest(templateDir)

    const projectNamePrompt = manifest.prompts.find(
        (item) => item.name === 'projectName',
    )
    if (projectNamePrompt) {
        projectNamePrompt.default = projectName
    }

    const config = await runPrompts(manifest.prompts)

    const transformResult = await loadTransform(templateDir, config)

    const s = p.spinner()
    s.start('正在生成项目…')

    mkdirSync(targetDir, { recursive: true })
    cpSync(templateDir, targetDir, { recursive: true })

    applyOperations(targetDir, transformResult)
    cleanScaffold(targetDir)

    s.stop('项目生成完成')

    p.outro(pc.green('流水线执行完毕'))

    return {
        projectName,
        template,
        templateDir,
        targetDir,
        manifest,
        config,
        transformResult,
    }
}
