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

export interface ISelectListItem {
    label: string
    value: string | number
}
export interface ISelectList {
    key: string
    message: string
    list: ISelectListItem[]
}
export interface IQuestionList extends IQuestionItemBase {
    type: 'list'
    choices: Question['choices']
    default?: string
}

export interface IUpdateItemQuestion {
    key: string
    label: string
    value: string
}
export interface IQuestionInput extends IQuestionItemBase {
    type: 'input'
    default?: string
}
