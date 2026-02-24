/** 驱动 @clack/prompts 交互，收集 config 对象 */
import * as p from '@clack/prompts'
import type { PromptItem } from '../core/types'

export async function runPrompts(
    prompts: PromptItem[],
): Promise<Record<string, unknown>> {
    const config: Record<string, unknown> = {}

    for (const item of prompts) {
        let value: unknown

        switch (item.type) {
            case 'text':
                value = await p.text({
                    message: item.message,
                    initialValue: item.default as string | undefined,
                })
                break

            case 'confirm':
                value = await p.confirm({
                    message: item.message,
                    initialValue: item.default as boolean | undefined,
                })
                break

            case 'select':
                value = await p.select({
                    message: item.message,
                    initialValue: item.default as string | undefined,
                    options: item.options ?? [],
                })
                break

            case 'multiselect':
                value = await p.multiselect({
                    message: item.message,
                    initialValues: item.default as string[] | undefined,
                    options: item.options ?? [],
                    required: false,
                })
                break
        }

        if (p.isCancel(value)) {
            p.cancel('操作已取消')
            process.exit(0)
        }

        config[item.name] = value
    }

    return config
}
