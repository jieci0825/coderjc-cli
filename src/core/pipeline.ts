/** 流水线调度器 —— 按阶段顺序驱动执行 */
import { cpSync, existsSync, mkdtempSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { readTemplates } from '../utils/cache'
import { CACHE_DIR } from '../utils/path'
import { parseManifest } from '../prompt/parser'
import { runPrompts } from '../prompt/runner'
import { loadTransform } from '../transform/loader'
import type { PipelineContext } from './context'

export async function runPipeline(
    projectName: string,
): Promise<PipelineContext> {
    p.intro(pc.cyan(`创建项目: ${projectName}`))

    if (!existsSync(CACHE_DIR)) {
        p.cancel('模板缓存不存在，请先执行: coderjc cache update')
        process.exit(1)
    }

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

    const tempDir = mkdtempSync(path.join(os.tmpdir(), 'cjc-'))
    cpSync(templateDir, tempDir, { recursive: true })

    const manifest = parseManifest(tempDir)

    const projectNamePrompt = manifest.prompts.find(
        (item) => item.name === 'projectName',
    )
    if (projectNamePrompt) {
        projectNamePrompt.default = projectName
    }

    const config = await runPrompts(manifest.prompts)

    const transformResult = await loadTransform(tempDir, config)

    p.note(JSON.stringify(transformResult, null, 2), 'TransformResult')
    p.outro(pc.green('流水线执行完毕（操作未执行）'))

    return {
        projectName,
        template,
        templateDir,
        tempDir,
        manifest,
        config,
        transformResult,
    }
}
