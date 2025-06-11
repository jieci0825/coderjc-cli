import { IQuestionInput, IUpdateItemQuestion } from '@/types'

export function updateItemQuestion(items: IUpdateItemQuestion[]) {
    const questions: IQuestionInput[] = items.map(item => {
        return {
            type: 'input',
            name: item.key,
            message: item.label,
            default: item.value
        }
    })

    return questions
}
