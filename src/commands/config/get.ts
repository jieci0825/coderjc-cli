import { configManagerInstance, danger, primary, validateConfigKey } from '@/utils'
import { table } from 'table'

// 显示模板列表 table
function showTemplateList() {
    const config = {
        header: {
            alignment: 'center',
            content: '模板列表字段描述'
        }
    }

    const templateList = configManagerInstance.getTemplateList()
    const tableData = [
        ['name', '选择模板时的名称'],
        ['description', '模板的描述'],
        ['value', '模板选中后的值'],
        ['originUrls', '模板下载的源地址'],
        ['isStore', '源地址是否是模板仓库']
    ]

    tableData.unshift(['key', '描述'])

    console.log(table(tableData, config as any))

    primary('模板列表配置数据：', { bold: true })
    console.log(templateList)
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
                process.exit(0)
            }

            // TODO 可以扩展更多配置...
        } else {
            showTemplateList()
        }
    } catch (error: any) {
        danger('获取配置失败：', error.message)
        process.exit(0)
    }
}
