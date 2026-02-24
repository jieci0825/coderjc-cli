/** 核心类型定义 */

export interface TemplateInfo {
  id: string
  name: string
  description: string
  version: string
}

export interface Manifest {
  prompts: PromptItem[]
}

export interface PromptOption {
  label: string
  value: string
}

export interface PromptItem {
  name: string
  type: 'confirm' | 'select' | 'multiselect' | 'text'
  message: string
  default?: unknown
  options?: PromptOption[]
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
