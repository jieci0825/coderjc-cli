import { IQuestionConfirm } from '@/types'

export function isForceQuestion() {
    const question: IQuestionConfirm = {
        type: 'confirm',
        name: 'force',
        message: '已经存在同名文件，是否强制覆盖？'
    }
    return question
}
