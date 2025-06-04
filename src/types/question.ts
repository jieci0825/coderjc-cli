import type { Question } from 'inquirer'

type InquirerQuestionType =
    | 'input'
    | 'number'
    | 'confirm'
    | 'list'
    | 'rawlist'
    | 'expand'
    | 'checkbox'
    | 'password'
    | 'editor'

export interface IQuestionItemBase {
    type: InquirerQuestionType
    name: string
    message: string
}

export interface IQuestionConfirm extends IQuestionItemBase {
    type: 'confirm'
    default?: boolean
}

export interface IQuestionList extends IQuestionItemBase {
    type: 'list'
    choices: Question['choices']
    default?: string
}
