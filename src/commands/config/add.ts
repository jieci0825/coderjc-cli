import { confirmItemQuestion, updateItemQuestion } from '@/questions'
import { ITemplateItem, IUpdateItemQuestion } from '@/types'
import { configManagerInstance, danger, info, success, validateConfigKey } from '@/utils'
import inquirer from 'inquirer'

async function processTL() {
    const items: IUpdateItemQuestion[] = [
        { label: '模板名称', key: 'name', value: '' },
        { label: '模板描述', key: 'description', value: '' },
        { label: '模板值(通常与模板名称相同)', key: 'value', value: '' },
        { label: '模板下载地址(多个用逗号,隔开)', key: 'originUrls', value: '' }
    ]

    try {
        const answers = await inquirer.prompt([
            ...updateItemQuestion(items),
            confirmItemQuestion({ name: 'isStore', message: '是否是模板仓库' })
        ])
        if (answers.originUrls) {
            answers.originUrls = answers.originUrls.split(',').map((item: string) => item.trim())
        }
        configManagerInstance.addTemplateItem(answers as ITemplateItem)
        success('修改成功')
    } catch (error) {
        info('取消操作')
    } finally {
        process.exit(0)
    }
}

export async function addCommand(key: string) {
    const validResult = validateConfigKey(key)
    if (!validResult.valid) {
        danger(validResult.message)
        process.exit(0)
    }

    if (key === 'template-list' || key === 'tl') {
        await processTL()
    }
}
