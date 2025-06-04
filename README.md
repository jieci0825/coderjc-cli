# coderjc CLI

> 集成了我个人一些常用的开发模板。
> 
> 如果觉得不错，欢迎star。而如果你使用的过程中遇到问题，欢迎提issue。
>
> 目前需要使用 `Node.js` 18+ 版本。暂时没有支持低版本的打算。

## 快速开始

### 安装
通常我们使用 `npm` 或 `pnpm` 进行安装，当然你也可以使用 `yarn`。
```bash
npm install coderjc-cli -g
pnpm install coderjc-cli -g
yarn global add coderjc-cli
```

### 使用
如果你是初次使用，那么可以执行如下命令，来创建一个项目。
```bash
cc create <project-name>
# or
coderjc create <project-name>
```
然后按照提示操作即可！

也可以通过附加参数，来指定模板。例如，创建一个基于 Koa 的接口示例。
```bash
cc create <project-name> --template <template-name>
```
当然，如果选择的模板后续存在其他配置，你仍然需要按照提示操作。

如果当前工作目录下存在同名项目，那么会询问是否覆盖。当然你也可以选择添加 `-f` 参数，来强制覆盖。
```bash
cc create <project-name> -f
# or
cc create <project-name> --template <template-name> -f
```


## 模板列表
- **Lite Vue Admin**：一个基于 Vue3 + Element Plus 的轻量级后台管理系统模板（JS/TS 双版本）
- **Koa Api Standard**：基于 Node.js + Koa 的 Web 接口开发模板（JS/TS 双版本）
- **Koa Quick Demo**：极简 Koa 接口示例，通常用于在你工作时，需要一个快速启动的接口示例。