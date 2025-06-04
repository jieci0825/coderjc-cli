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
    default?: boolean
}
