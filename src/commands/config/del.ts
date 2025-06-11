import { singleInputQuestion } from '@/questions'
import { configManagerInstance, danger, info, success, validateConfigKey } from '@/utils'
import inquirer from 'inquirer'

async function processTL() {
    try {
        const len = configManagerInstance.getTemplateList().length
        if (len === 0) {
            danger('模板列表为空，无法删除')
            process.exit(0)
        }

        const data = { key: 'index', label: '请输入要删除的模板列表索引', value: '0' }
        const answers = await inquirer.prompt(singleInputQuestion(data))

        const index = Number(answers.index)
        if (isNaN(index)) {
            danger('请输入数字')
            process.exit(0)
        }
        // 检测索引是否合法
        if (index < 0 || index >= len) {
            danger(`索引超出范围，应在 0 ~ ${len - 1} 之间`)
            process.exit(0)
        }
        configManagerInstance.delTemplateItem(index)
        success('删除成功')
    } catch (error) {
        info('取消操作')
        process.exit(0)
    }
}

export async function delCommand(key: string) {
    const validResult = validateConfigKey(key)
    if (!validResult.valid) {
        danger(validResult.message)
        process.exit(0)
    }

    if (key === 'template-list' || key === 'tl') {
        await processTL()
    }
}
