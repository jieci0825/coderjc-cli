import { IQuestionInput, IUpdateItemQuestion } from '@/types'

export function updateItemQuestion(items: IUpdateItemQuestion[]) {
    const questions: IQuestionInput[] = items.map(item => {
        return {
            type: 'input',
            name: item.key,
            message: item.lebel,
            default: item.value
        }
    })

    return questions
}
