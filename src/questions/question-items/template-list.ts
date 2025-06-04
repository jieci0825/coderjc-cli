import { TemplateList } from '@/configs'
import { IQuestionList } from '@/types'

export function templateListQuestion() {
    const question: IQuestionList = {
        type: 'list',
        name: 'templateName',
        message: '请选择模板',
        choices: TemplateList.map(item => {
            return {
                name: item.name,
                value: item.value
            }
        })
    }

    return question
}
