import { confirmItemQuestion, updateItemQuestion } from '@/questions'
import { ITemplateItem, IUpdateItemQuestion } from '@/types'
import { configManagerInstance, danger, info, success, validateConfigKey } from '@/utils'
import inquirer from 'inquirer'

// 处理模板列表的修改
async function processTL(index: number) {
    const templateItem = configManagerInstance.getTemplateItem(index)
    if (!templateItem) {
        danger(`模板列表中索引 ${index} 不存在对应的模板`)
        process.exit(0)
    }

    const labelMap: any = {
        name: '模板名称',
        description: '模板描述',
        value: '模板值',
        originUrls: '模板下载地址(多个用逗号,隔开)',
        isStore: '是否是模板仓库'
    }

    const items: IUpdateItemQuestion[] = Object.entries(templateItem)
        .map(([key, value]) => {
            return { key, lebel: labelMap[key], value }
        })
        .filter(item => item.key !== 'isStore')

    try {
        const answers = await inquirer.prompt([
            ...updateItemQuestion(items),
            confirmItemQuestion({ name: 'isStore', message: '是否是模板仓库' })
        ])
        configManagerInstance.updateTemplateItem(index, answers as ITemplateItem)
        success('修改成功')
    } catch (error) {
        info('取消操作')
    } finally {
        process.exit(0)
    }
}

export async function setCommand(key: string, value: string) {
    const validResult = validateConfigKey(key)
    if (!validResult.valid) {
        danger(validResult.message)
        process.exit(0)
    }

    if (key === 'template-list' || key === 'tl') {
        await processTL(+value)
    }
}
