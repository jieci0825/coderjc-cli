import { configManagerInstance, danger, primary, validateConfigKey } from '@/utils'
import { table } from 'table'

// 显示模板列表 table
function showTemplateList() {
    const config = {
        header: {
            alignment: 'center',
            content: '模板列表\n第一行表示模板在配置中的字段名\n第二行的文本描述表示该字段所具备的意义'
        }
    }

    const templateList = configManagerInstance.getTemplateList()
    const tableData = [
        ...templateList.map(item => {
            return [item.name, item.description, item.value, item.originUrl]
        })
    ]

    tableData.unshift(['选择模板时的名称', '模板的描述', '模板选中后的值', '模板下载的源地址'])
    tableData.unshift(['name', 'description', 'value', 'originUrl'])

    console.log(table(tableData, config as any))
}

export function getCommand(key?: string) {
    try {
        if (key) {
            const validResult = validateConfigKey(key)
            if (!validResult.valid) {
                danger(validResult.message)
                process.exit(0)
            }

            if (key === 'template-list' || key === 'tl') {
                showTemplateList()
                return
            }

            // TODO 可以扩展更多配置...
        } else {
            showTemplateList()
        }
    } catch (error: any) {
        danger('获取配置失败：', error.message)
    }
}
