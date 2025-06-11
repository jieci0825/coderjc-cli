import { IQuestionList, ISelectList } from '@/types'

export function selectListQuestion(params: ISelectList) {
    const question: IQuestionList = {
        type: 'list',
        name: params.key || 'select',
        message: params.message || '请选择',
        choices: params.list.map(item => {
            return {
                name: item.label,
                value: item.value
            }
        })
    }

    return question
}
