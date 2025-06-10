import { IQuestionConfirm } from '@/types'

interface IConfirmItem {
    name?: string
    message?: string
}
export function confirmItemQuestion(params?: IConfirmItem) {
    const { name, message } = params || {}

    const question: IQuestionConfirm = {
        type: 'confirm',
        name: name || 'value',
        message: message || '确认执行这个操作吗'
    }
    return question
}
