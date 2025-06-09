import { getTemplateList } from '@/configs'
import { IQuestionList } from '@/types'

export function templateListQuestion() {
    const templateList = getTemplateList()

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
