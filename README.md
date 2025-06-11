# coderjc CLI

> 🚀 一个功能强大的项目模板管理工具，帮助你快速创建项目并管理自定义模板。支持从 Git 仓库拉取模板，智能化项目初始化，让开发更高效！

[![npm version](https://img.shields.io/npm/v/coderjc-cli.svg)](https://www.npmjs.com/package/coderjc-cli)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jieci0825/coderjc-cli/blob/main/LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## ✨ 特性

- 🎯 **快速创建项目** - 一键从模板创建新项目
- 📦 **灵活模板管理** - 支持添加、删除、导入、导出模板配置  
- 🔗 **Git 仓库支持** - 从 Git 仓库直接拉取模板
- 🛠️ **配置管理** - 完善的配置管理系统
- 📋 **模板列表** - 直观的表格展示可用模板
- 🔄 **批量导入** - 支持从 JSON 文件或 Git 模板仓库批量导入

## 📋 环境要求

⚠️ **重要提示：**

- **Node.js 版本**: `>=18.0.0` *(必须)*
- **Git 环境**: 必须安装 Git 并配置好环境变量 *(必须)*
- **模板要求**: 所有 Git 模板仓库地址必须是 **开源的、可公开访问的**

## 🚀 安装

你可以使用以下任一包管理器进行全局安装：

```bash
# 使用 npm
npm install coderjc-cli -g

# 使用 pnpm  
pnpm install coderjc-cli -g

# 使用 yarn
yarn global add coderjc-cli
```

安装完成后，你可以使用 `coderjc` 或简写 `cc` 命令：

```bash
# 查看版本
cc --version

# 查看帮助
cc --help
```

## ⚡ 快速开始

### 1. 创建第一个项目

```bash
# 交互式创建项目（推荐）
cc create my-project

# 指定模板创建项目
cc create my-project --template koa-quick

# 强制覆盖同名目录
cc create my-project --force
# or
cc create my-project -f
```

### 2. 查看可用模板

```bash
cc list
```

### 3. 管理模板配置

```bash
# 查看所有配置
cc config

# 添加单个模板
cc config add templateList

# 从 Git 仓库导入单个模板
cc import --git https://github.com/your-username/your-template.git

# 从模板仓库批量导入
cc import --gits https://github.com/your-username/template-store.git
```

## 📚 命令详解

### `cc create <project-name>` - 创建项目

从模板创建新项目，支持交互式选择或指定模板。

**语法：**
```bash
cc create <project-name> [options]
```

**参数：**
- `<project-name>` - 项目名称（必填）

**选项：**
- `-t, --template <template-name>` - 指定模板名称
- `-f, --force` - 强制覆盖已存在的同名目录

**使用示例：**
```bash
# 交互式创建
cc create my-app

# 指定模板创建
cc create my-api --template koa-server-ts

# 强制覆盖创建
cc create my-app --force

# 组合使用
cc create my-app --template vue3-admin --force
```

**注意事项：**
- 项目名称必须符合 npm 包命名规范
- 如果目录已存在且未使用 `--force`，会询问是否覆盖
- 创建成功后会自动修改 `package.json` 中的项目名称

---

### `cc list` - 查看模板列表

以表格形式展示所有可用的项目模板。

**语法：**
```bash
cc list
```

**输出示例：**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              可用模板列表                                     │
├──────────────────┬────────────────────────────────────────┬─────────────────┤
│    模板名称      │                模板描述                │  是否模板仓库   │
├──────────────────┼────────────────────────────────────────┼─────────────────┤
│   koa-quick      │        一个非常简单的koa项目模板        │       是        │
│  koa-server-js   │       用于开发的koa服务器模板(JS)       │       是        │
│  koa-server-ts   │       用于开发的koa服务器模板(TS)       │       是        │
│  vue3-admin      │     Vue3 + Element Plus 管理系统       │       否        │
│  react-app       │      React + TypeScript 应用模板       │       否        │
└──────────────────┴────────────────────────────────────────┴─────────────────┘
```

---

### `cc import` - 导入模板配置

支持从多种来源导入模板配置。

**语法：**
```bash
cc import [options]
```

**选项：**
- `--file <path>` - 从 JSON 文件导入模板配置
- `--gits <url>` - 从 Git 模板仓库导入多个模板  
- `--git <url>` - 从 Git 仓库导入单个模板
- `--merge` - 与现有配置合并（相同 value 会跳过）

**使用示例：**

1. **从 JSON 文件导入**
```bash
# 替换模式（清空原配置）
cc import --file ./templates.json

# 合并模式（保留原配置）
cc import --file ./templates.json --merge
```

2. **从模板仓库导入**
```bash
# 从模板仓库导入多个模板
cc import --gits https://github.com/username/template-store.git

# 合并模式导入
cc import --gits https://github.com/username/template-store.git --merge
```

3. **从单个仓库导入**
```bash
# 导入单个模板（不支持 --merge）
cc import --git https://github.com/username/single-template.git
```

**JSON 文件格式示例：**
```json
{
  "templateList": [
    {
      "name": "vue3-admin",
      "description": "Vue 3 后台管理系统模板", 
      "originUrls": ["https://github.com/username/vue3-admin.git"],
      "value": "vue3-admin",
      "isStore": false
    }
  ]
}
```

**注意事项：**
- `--gits` 用于导入包含多个模板的仓库
- `--git` 用于导入单个模板仓库
- 默认为替换模式，使用 `--merge` 启用合并模式
- Git 仓库必须公开可访问

---

### `cc config` - 配置管理

完整的配置管理系统，支持查看、设置、添加、删除配置。

#### 基础命令

**查看所有配置：**
```bash
cc config
```

**查看支持的配置项：**
```bash
cc config keys
```

#### 子命令详解

##### `cc config get <key>` - 获取配置
```bash
# 获取模板列表
cc config get templateList
cc config get tl  # 简写

# 获取特定配置项
cc config get <key>
```

##### `cc config set <key>` - 设置配置
```bash
# 交互式设置模板列表
cc config set templateList
cc config set tl  # 简写
```

##### `cc config add <key>` - 添加配置
```bash
# 添加新的模板配置
cc config add templateList
cc config add tl  # 简写
```

##### `cc config del <key>` - 删除配置
```bash
# 删除指定模板配置
cc config del templateList
cc config del tl  # 简写
```

##### `cc config reset [key]` - 重置配置
```bash
# 重置所有配置为默认值
cc config reset

# 重置指定配置项
cc config reset templateList
```

##### `cc config clear <key>` - 清空配置
```bash
# ⚠️ 危险操作：清空所有模板配置
cc config clear templateList
```

**支持的配置 key：**
- `templateList` / `tl` - 模板列表配置

---

## 💡 最佳实践

### 推荐的模板管理方式

根据你的模板组织方式，我们推荐以下最佳实践：

#### 🎯 **场景一：集中式模板仓库**

如果你的模板都存放在一个模板仓库中（如一个 Git 仓库包含多个子目录，每个子目录是一个独立的模板），推荐使用：

```bash
# 一键导入所有模板，自动识别并配置
cc import --gits https://github.com/your-username/template-store.git
```

**优势：**
- ✅ **自动化程度高** - 工具会自动扫描仓库中的所有模板目录
- ✅ **配置简单** - 一条命令完成所有模板的导入
- ✅ **维护便利** - 模板集中管理，更新时重新导入即可

**示例仓库结构：**
```
your-template-store/
├── vue3-admin/         # Vue3 管理系统模板
├── react-app/          # React 应用模板  
├── koa-api/            # Koa API 模板
├── nextjs-blog/        # Next.js 博客模板
└── ...                 # 更多模板
```

#### 📦 **场景二：分散式独立仓库**

如果你有很多模板，且每个模板都是独立的 Git 仓库，推荐创建一个 JSON 配置文件进行批量管理：

```bash
# 创建配置文件后批量导入
cc import --file ./my-templates.json
```

**优势：**
- ✅ **灵活控制** - 可以精确控制每个模板的配置信息
- ✅ **版本管理** - JSON 文件可以版本化管理，便于团队协作
- ✅ **部分导入** - 可以选择性导入部分模板

**JSON 配置文件示例：**
```json
{
  "templateList": [
    {
      "name": "Vue3 Admin",
      "description": "基于 Vue3 + Element Plus 的后台管理系统",
      "originUrls": [
        "https://github.com/your-team/vue3-admin-template.git",
        "https://gitee.com/your-team/vue3-admin-template.git"
      ],
      "value": "vue3-admin",
      "isStore": false
    },
    {
      "name": "React TypeScript App",
      "description": "React + TypeScript + Vite 快速开发模板",
      "originUrls": ["https://github.com/your-team/react-ts-template.git"],
      "value": "react-ts",
      "isStore": false
    },
    {
      "name": "Koa API Server",
      "description": "基于 Koa2 的 RESTful API 服务模板",
      "originUrls": ["https://github.com/your-team/koa-api-template.git"],
      "value": "koa-api",
      "isStore": false
    }
  ]
}
```

### 📋 选择建议

| 场景 | 推荐方式 | 适用情况 |
|------|----------|----------|
| **集中管理** | `cc import --gits` | • 模板数量适中（5-20个）<br>• 希望统一管理和维护<br>• 团队共享相同的模板集 |
| **分散管理** | `cc import --file` | • 模板数量很多（20+个）<br>• 模板来源不同（不同组织/个人）<br>• 需要精细化配置管理 |
| **混合管理** | 组合使用 | • 既有集中仓库又有独立仓库<br>• 使用 `--merge` 参数逐步添加 |

### 🔄 更新维护建议

- **定期更新**：建议定期重新导入模板配置，确保使用最新版本
- **备份配置**：使用 `cc config get templateList` 备份当前配置
- **测试验证**：新导入模板后，建议先创建测试项目验证模板可用性

---

## 🛠️ 配置文件

工具会在用户目录下创建配置文件：

**配置文件结构：**

```json
{
  "templateList": [
    {
      "name": "模板名称",
      "description": "模板描述", 
      "originUrls": ["Git仓库地址"],
      "value": "模板标识符",
      "isStore": false
    }
  ]
}
```

**字段说明：**
- `name` - 模板显示名称
- `description` - 模板描述信息
- `originUrls` - Git 仓库地址数组（支持多个镜像地址）
- `value` - 模板唯一标识符
- `isStore` - 是否为模板仓库（包含多个子模板的表示仓库为 true，一个 git 地址对应一个模板的则为 false）**`这个非常重要，关系到下载的时候如何处理模板`**

## 🏗️ 模板仓库结构

### 单个模板仓库
```
your-template/
├── package.json        # 必须包含 name 和 description
├── src/
├── public/
└── ...                # 其他模板文件
```

### 模板仓库（多模板）
```
template-store/
├── vue3-admin/         # 模板1
│   ├── package.json
│   └── ...
├── react-app/          # 模板2  
│   ├── package.json
│   └── ...
└── ...                # 更多模板
```

## 🚨 注意事项

1. **网络环境**：确保网络可以正常访问 Git 仓库
2. **权限问题**：某些模板可能需要 Git 仓库访问权限
3. **模板质量**：建议使用经过测试的模板仓库
4. **版本兼容**：模板应该与当前 Node.js 版本兼容
5. **目录覆盖**：创建项目前请确认目录名称，避免意外覆盖

## 🔧 故障排除

### 常见问题

**Q: 创建项目失败，提示 Git 错误**  
A: 检查 Git 是否正确安装，网络是否可访问仓库地址

**Q: 模板列表为空**  
A: 使用 `cc import` 命令导入模板配置，或使用 `cc config add templateList` 手动添加

**Q: 项目名称不符合规范**  
A: 项目名称需符合 npm 包命名规范：小写字母、数字、连字符

**Q: Node.js 版本过低**  
A: 升级 Node.js 到 18.0.0 或更高版本

## 📄 许可证

[MIT License](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

如果这个工具对你有帮助，请考虑给项目一个 ⭐️ Star！

## 📞 联系方式

- 项目地址：[https://github.com/jieci0825/coderjc-cli](https://github.com/jieci0825/coderjc-cli)
- 作者邮箱：coderjc@qq.com
- 问题反馈：[GitHub Issues](https://github.com/jieci0825/coderjc-cli/issues)