/** 驱动 @clack/prompts 交互，收集 config 对象 */
import * as p from '@clack/prompts'
import type { PromptItem } from '../core/types'

type PromptHandler = (item: PromptItem) => Promise<unknown>

const handlers: Record<string, PromptHandler> = {
    text: (item) =>
        p.text({
            message: item.message,
            initialValue: item.default as string | undefined,
        }),

    confirm: (item) =>
        p.confirm({
            message: item.message,
            initialValue: item.default as boolean | undefined,
        }),

    select: (item) =>
        p.select({
            message: item.message,
            initialValue: item.default as string | undefined,
            options: item.options ?? [],
        }),

    multiselect: (item) =>
        p.multiselect({
            message: item.message,
            initialValues: item.default as string[] | undefined,
            options: item.options ?? [],
            required: false,
        }),
}

export async function runPrompts(
    prompts: PromptItem[],
): Promise<Record<string, unknown>> {
    const config: Record<string, unknown> = {}

    for (const item of prompts) {
        const handler = handlers[item.type]
        if (!handler) {
            throw new Error(`未知的 prompt 类型: ${item.type}`)
        }

        const value = await handler(item)

        if (p.isCancel(value)) {
            p.cancel('操作已取消')
            process.exit(0)
        }

        config[item.name] = value
    }

    return config
}
