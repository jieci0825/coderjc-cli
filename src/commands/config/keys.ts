import { table } from 'table'

export function keysCommand() {
    const tableData = [
        ['template-list', '查看模板列表配置', 'get | set | clear | reset'],
        ['tl', 'template-list 的缩写', 'get | set | clear | reset']
    ]

    const config = {
        header: {
            alignment: 'center',
            content: '支持的 key'
        }
    }

    tableData.unshift(['key', '说明', '支持的方法'])

    console.log(table(tableData, config as any))
}
