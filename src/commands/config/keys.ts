import { table } from 'table'

export function keysCommand() {
    const tableData = [
        ['template-list', '查看模板列表配置'],
        ['tl', 'template-list 的缩写']
    ]

    const config = {
        header: {
            alignment: 'center',
            content: '支持的 key'
        }
    }

    console.log(table(tableData, config as any))
}
