import { IQuestionInput, IUpdateItemQuestion } from '@/types'

export function singleInputQuestion(params: IUpdateItemQuestion) {
    const question: IQuestionInput = {
        type: 'input',
        name: params.key,
        message: params.label,
        default: params.value
    }

    return question
}
