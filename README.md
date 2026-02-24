# coderjc-cli

通用脚手架工具。根据模板定义动态生成交互式命令，收集用户配置，执行声明式操作指令对模板进行裁剪，输出定制化项目。

CLI 本身不包含任何与具体模板相关的业务逻辑，业务裁剪逻辑完全由模板自身声明。

---

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [命令参考](#命令参考)
- [工作流程](#工作流程)
- [模板仓库结构](#模板仓库结构)
  - [templates.json](#templatesjson)
  - [.scaffold 目录](#scaffold-目录)
  - [manifest.json](#manifestjson)
  - [transform.js](#transformjs)
- [操作指令协议](#操作指令协议)
  - [TransformResult 类型定义](#transformresult-类型定义)
  - [操作原语](#操作原语)
  - [执行顺序](#执行顺序)
- [区域标记规范](#区域标记规范)
  - [标记语法](#标记语法)
  - [使用示例](#使用示例)
  - [解析校验规则](#解析校验规则)
- [项目结构](#项目结构)
- [开发](#开发)
- [许可证](#许可证)

---

## 安装

```bash
npm install -g coderjc-cli
```

安装后可通过 `coderjc` 或简写 `cjc` 调用。

---

## 快速开始

```bash
# 1. 设置模板仓库地址
coderjc config registry <git-repo-url>

# 2. 拉取模板缓存
coderjc cache update

# 3. 查看可用模板
coderjc list

# 4. 创建项目
coderjc create my-project
```

执行 `create` 命令后，CLI 将引导你选择模板、回答交互式问题，最终在当前目录下生成定制化的项目。

---

## 命令参考

### `coderjc create <project-name>`

创建新项目。流程包括：选择模板、回答交互式问题、执行操作指令、输出最终项目。

若目标目录已存在且非空，CLI 将提示选择处理方式（取消 / 覆盖 / 忽略已有文件）。

### `coderjc list`

列出当前缓存中所有可用的模板及其描述。

### `coderjc cache update`

从配置的远程仓库地址克隆或更新模板缓存。首次执行为 `git clone`，后续执行为 `git pull`。

### `coderjc cache clean`

删除本地模板缓存目录。

### `coderjc config registry [value]`

查看或设置模板仓库的 Git 地址。

- 不传 `value`：打印当前值
- 传入 `value`：更新为新值

### `coderjc config list`

列出所有配置项及其当前值。

### 全局选项

| 选项 | 说明 |
| --- | --- |
| `-v, --version` | 显示版本号 |
| `-h, --help` | 显示帮助信息 |

---

## 工作流程

```
coderjc create <project-name>
        │
        ▼
  检查模板缓存是否存在
        │
        ▼
  展示模板列表，用户选择模板
        │
        ▼
  读取 .scaffold/manifest.json，解析交互问题定义
        │
        ▼
  运行交互式问题，收集用户配置（config 对象）
        │
        ▼
  加载 .scaffold/transform.js，传入 config，获得 TransformResult
        │
        ▼
  将模板文件复制到目标目录
        │
        ▼
  按固定顺序执行操作指令：
    1. region-remove（删除区域标记包裹的代码块）
    2. delete（按 glob 删除文件/目录）
    3. rename（重命名文件）
    4. json（JSON 文件字段级操作）
    5. deps（package.json 依赖增删）
    6. clean（清理残留的区域标记行）
        │
        ▼
  删除 .scaffold/ 目录
        │
        ▼
  输出完成
```

---

## 模板仓库结构

模板统一存放在一个 Git 仓库中，目录结构如下：

```
templates-repo/
├── templates.json              # 模板列表
├── vue-admin-ts/
│   ├── .scaffold/
│   │   ├── manifest.json       # 模板元信息 + 交互问题定义
│   │   └── transform.js        # 接收 config，返回操作指令
│   ├── src/
│   ├── package.json
│   └── ...
└── react-app/
    ├── .scaffold/
    └── ...
```

### templates.json

仓库根目录下的模板注册表。CLI 从缓存中读取该文件以展示可选模板列表。

```json
[
  {
    "id": "vue-admin-ts",
    "name": "vue-admin-ts",
    "description": "Vue3 + TypeScript 后台管理模板",
    "version": "1.0.0"
  }
]
```

每个条目对应仓库中的一个模板目录。

### .scaffold 目录

每个模板根目录下必须包含 `.scaffold/` 目录，其中存放脚手架配置文件。该目录在项目生成完成后会被自动删除，不会出现在最终输出中。

### manifest.json

位于 `.scaffold/manifest.json`，定义交互式问题。CLI 据此动态生成命令行提示。

```json
{
  "prompts": [
    {
      "name": "mock",
      "type": "confirm",
      "message": "是否需要 Mock Server？",
      "default": false
    },
    {
      "name": "cssPreprocessor",
      "type": "select",
      "message": "选择 CSS 预处理器",
      "options": [
        { "label": "SCSS", "value": "scss" },
        { "label": "Less", "value": "less" }
      ]
    }
  ]
}
```

支持的问题类型：

| 类型 | 说明 |
| --- | --- |
| `text` | 文本输入 |
| `confirm` | 是 / 否确认 |
| `select` | 单选 |
| `multiselect` | 多选 |

### transform.js

位于 `.scaffold/transform.js`，导出一个函数，接收用户配置对象 `config`，返回 `TransformResult` 操作指令集。

```js
export default function (config) {
  const operations = []
  const deps = { add: {}, addDev: {}, remove: [], removeDev: [] }
  const json = []

  if (!config.mock) {
    operations.push({ action: 'delete', pattern: 'mock-server/**' })
    operations.push({ action: 'region-remove', region: 'mock' })
    json.push({ file: 'package.json', removeFields: ['scripts.mock'] })
    deps.removeDev.push('mockjs')
  }

  if (config.cssPreprocessor === 'less') {
    operations.push({ action: 'delete', pattern: '**/*.scss' })
    deps.removeDev.push('sass')
    deps.addDev['less'] = '^4.2.0'
  }

  return { operations, deps, json }
}
```

---

## 操作指令协议

### TransformResult 类型定义

```ts
interface TransformResult {
  operations?: Operation[]
  deps?: DepsOperation
  json?: JsonOperation[]
}

type Operation =
  | { action: 'delete'; pattern: string }
  | { action: 'rename'; from: string; to: string }
  | { action: 'region-remove'; region: string }

interface DepsOperation {
  add?: Record<string, string>
  addDev?: Record<string, string>
  remove?: string[]
  removeDev?: string[]
}

interface JsonOperation {
  file: string
  merge?: Record<string, unknown>
  removeFields?: string[]
}
```

### 操作原语

| 原语 | 作用域 | 说明 |
| --- | --- | --- |
| `delete` | 文件 / 目录 | 按 glob pattern 删除匹配的文件或目录 |
| `rename` | 文件 | 将 `from` 路径重命名为 `to` 路径 |
| `region-remove` | 文件内部 | 删除文件中被指定区域标记包裹的代码块（含标记行本身） |
| `deps` | package.json | 增删 `dependencies` 和 `devDependencies` |
| `json` | 任意 JSON 文件 | 字段级增删改，支持点路径寻址（如 `scripts.dev`）和深度合并 |

### 执行顺序

CLI 按以下固定顺序执行操作指令，以确保各操作之间不产生冲突：

1. **region-remove** — 扫描所有文本文件，删除指定区域标记包裹的内容
2. **delete** — 按 glob 删除文件和目录
3. **rename** — 重命名文件
4. **json** — JSON 文件字段级操作
5. **deps** — package.json 依赖增删
6. **clean** — 清理所有文件中残留的 `#scaffold` 标记行（保留标记内的内容，仅移除标记行本身）

---

## 区域标记规范

区域标记用于在模板源文件中标识"可选代码块"的边界。当用户未选择某功能时，CLI 通过 `region-remove` 操作删除对应区域；对于保留的区域，`clean` 步骤会移除标记行本身，使最终输出的代码不含任何标记痕迹。

### 标记语法

标记分为开始标记和结束标记，必须显式配对，禁止使用相同标记隐式匹配。

| 文件类型 | 开始标记 | 结束标记 |
| --- | --- | --- |
| JS / TS | `// #scaffold-start:name` | `// #scaffold-end:name` |
| HTML / Vue | `<!-- #scaffold-start:name -->` | `<!-- #scaffold-end:name -->` |
| CSS / SCSS | `/* #scaffold-start:name */` | `/* #scaffold-end:name */` |

其中 `name` 为区域标识符，与 `region-remove` 操作中的 `region` 字段对应。

### 使用示例

模板源文件：

```ts
import { createApp } from 'vue'
import App from './App.vue'

// #scaffold-start:mock
import { setupMock } from './mock'
// #scaffold-end:mock

// #scaffold-start:i18n
import { i18n } from './locales'
// #scaffold-end:i18n

const app = createApp(App)

// #scaffold-start:i18n
app.use(i18n)
// #scaffold-end:i18n

// #scaffold-start:mock
setupMock(app)
// #scaffold-end:mock

app.mount('#app')
```

当用户不选择 `mock` 功能时，执行 `region-remove: mock` 后，`mock` 区域内的代码连同标记行一起被删除。最终经过 `clean` 步骤后，剩余的 `i18n` 标记行也被移除，输出干净的代码：

```ts
import { createApp } from 'vue'
import App from './App.vue'

import { i18n } from './locales'

const app = createApp(App)

app.use(i18n)

app.mount('#app')
```

### 解析校验规则

- 每个 `#scaffold-start:name` 必须有对应的同名 `#scaffold-end:name`，否则抛出错误并指明文件路径和行号
- 每个 `#scaffold-end:name` 必须有前置的同名 `#scaffold-start:name`，否则同上
- 同一文件中同名区域可出现多次（非嵌套），每对独立处理
- 不支持同名区域的嵌套

---
