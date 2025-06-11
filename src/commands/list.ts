import type { Command } from 'commander'
import { table } from 'table'
import { configManagerInstance, primary, success, danger, info } from '@/utils'

export default function listCommand(program: Command) {
    program
        .command('list')
        .description('查看所有可用的项目模板')
        .action(() => {
            const templateList = configManagerInstance.getTemplateList()

            if (!templateList || templateList.length === 0) {
                // 显示空数据表格
                const emptyTableData = [
                    // 表头行
                    [
                        primary('模板名称', {}, false),
                        primary('模板描述', {}, false),
                        primary('是否模板仓库', {}, false)
                    ],
                    // 空数据提示行（三个单元格，但会被合并）
                    [info('暂无可用的模板配置，请先添加模板', {}, false), '', '']
                ]

                const emptyConfig = {
                    border: {
                        topBody: '─',
                        topJoin: '┬',
                        topLeft: '┌',
                        topRight: '┐',
                        bottomBody: '─',
                        bottomJoin: '┴',
                        bottomLeft: '└',
                        bottomRight: '┘',
                        bodyLeft: '│',
                        bodyRight: '│',
                        bodyJoin: '│',
                        joinBody: '─',
                        joinLeft: '├',
                        joinRight: '┤',
                        joinJoin: '┼'
                    },
                    header: {
                        alignment: 'center' as const,
                        content: primary('可用模板列表', { bold: true }, false)
                    },
                    columnDefault: {
                        alignment: 'center' as const
                    },
                    columns: [
                        { alignment: 'center' as const, width: 20 },
                        { alignment: 'left' as const, width: 35 },
                        { alignment: 'center' as const, width: 15 }
                    ],
                    spanningCells: [{ col: 0, row: 1, colSpan: 3, alignment: 'center' as const }]
                }

                console.log(table(emptyTableData, emptyConfig))
                return
            }

            // 创建表格数据
            const tableData = [
                // 表头行
                [primary('模板名称', {}, false), primary('模板描述', {}, false), primary('是否模板仓库', {}, false)]
            ]

            // 添加模板数据行
            templateList.forEach(template => {
                tableData.push([
                    success(template.name, {}, false),
                    template.description,
                    template.isStore ? success('是', {}, false) : danger('否', {}, false)
                ])
            })

            // 表格配置
            const config = {
                border: {
                    topBody: '─',
                    topJoin: '┬',
                    topLeft: '┌',
                    topRight: '┐',
                    bottomBody: '─',
                    bottomJoin: '┴',
                    bottomLeft: '└',
                    bottomRight: '┘',
                    bodyLeft: '│',
                    bodyRight: '│',
                    bodyJoin: '│',
                    joinBody: '─',
                    joinLeft: '├',
                    joinRight: '┤',
                    joinJoin: '┼'
                },
                header: {
                    alignment: 'center' as const,
                    content: primary('可用模板列表', { bold: true }, false)
                },
                columnDefault: {
                    alignment: 'left' as const
                },
                columns: [
                    { alignment: 'center' as const, width: 20 },
                    { alignment: 'left' as const, width: 35 },
                    { alignment: 'center' as const, width: 15 }
                ]
            }

            // 输出表格
            console.log(table(tableData, config))
        })
}
