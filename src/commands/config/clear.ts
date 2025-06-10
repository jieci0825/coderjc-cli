import { configManagerInstance, danger, validateConfigKey } from '@/utils'

function processTL() {
    configManagerInstance.resetTemplateList()
}

export async function clearCommand(key: string) {
    const validResult = validateConfigKey(key)
    if (!validResult.valid) {
        danger(validResult.message)
        process.exit(0)
    }

    if (key === 'template-list' || key === 'tl') {
        processTL()
    }
}
