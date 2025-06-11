import { IUpdateItemQuestion } from '@/types'

export function singleInputQuestion(data: IUpdateItemQuestion) {
    const question = {
        type: 'input',
        name: data.key,
        message: data.label,
        default: data.value
    }

    return question
}
