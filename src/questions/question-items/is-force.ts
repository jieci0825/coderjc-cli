import { IQuestionItemBase } from '@/types'

export default function isForceQuestion() {
    const question: IQuestionItemBase = {
        type: 'confirm',
        name: 'force',
        message: '已经存在同名文件，是否强制覆盖？'
    }
    return question
}
