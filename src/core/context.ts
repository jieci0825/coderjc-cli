/** 流水线上下文 —— 贯穿各阶段的共享状态 */
import type { Manifest, TemplateInfo, TransformResult } from './types'

export interface PipelineContext {
    projectName: string
    template: TemplateInfo
    templateDir: string
    tempDir: string
    manifest: Manifest
    config: Record<string, unknown>
    transformResult: TransformResult
}
