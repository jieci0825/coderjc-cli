/** 核心类型定义 */

export interface TemplateInfo {
  name: string
  description: string
  repo: string
}

export interface Manifest {
  name: string
  version: string
  description: string
  prompts: PromptItem[]
}

export interface PromptItem {
  name: string
  type: 'confirm' | 'select' | 'text'
  message: string
  initial?: unknown
  choices?: string[]
}

export interface TransformResult {
  operations?: Operation[]
  deps?: DepsOperation
  json?: JsonOperation[]
}

export type Operation =
  | { action: 'delete'; pattern: string }
  | { action: 'rename'; from: string; to: string }
  | { action: 'region-remove'; region: string }

export interface DepsOperation {
  add?: Record<string, string>
  addDev?: Record<string, string>
  remove?: string[]
  removeDev?: string[]
}

export interface JsonOperation {
  file: string
  merge?: Record<string, unknown>
  removeFields?: string[]
}
