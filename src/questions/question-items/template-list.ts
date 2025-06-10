import { IQuestionList } from '@/types'
import { configManagerInstance } from '@/utils'

export function templateListQuestion() {
    const templateList = configManagerInstance.getTemplateList()

    const question: IQuestionList = {
        type: 'list',
        name: 'templateName',
        message: '请选择模板',
        choices: templateList.map(item => {
            return {
                name: item.name,
                value: item.value
            }
        })
    }

    return question
}
