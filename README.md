# youdeyiwu-editor

youdeyiwu-editor 尤得一物-编辑器

以 classic editor 为基础自定义构建，集成了自定义和常用插件

## 1. 主页

- 访问

演示 [www.youdeyiwu.com](https://www.youdeyiwu.com)

- 相关

前端 [youdeyiwu-frontend](https://github.com/dafengzhen/youdeyiwu-frontend)

## 2. 开发

### `dev`

创建具有简体界面的编辑器

```bash
yarn run dev
```

### `start`

```bash
# 启动服务器并打开浏览器.
yarn run start

# 禁用自动打开浏览器.
yarn run start --no-open

# 创建具有简体界面的编辑器.
yarn run start --language=zh-cn
```

### `test`

* `--coverage` &ndash; 创建代码覆盖率报告,
* `--watch` &ndash; 观察源文件（该命令在执行测试后不会结束）,
* `--source-map` &ndash; 产生源文件的源地图,
* `--verbose` &ndash; 打印额外的 webpack 日志.

```bash
# 执行测试.
yarn run test

# 如果源码变化，则生成代码覆盖率报告.
yarn run test --coverage --test
```

### `lint`

```bash
# 执行 eslint.
yarn run lint
```

### `stylelint`

```bash
# 执行 stylelint.
yarn run stylelint
```

### `dll:build`

创建一个与 DLL 兼容的软件包构建，可以使用 [DLL builds](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) 加载到编辑器中.

```bash
# 建立准备发布的 DLL 文件.
yarn run dll:build

# 构建 DLL 文件并监听其来源的变化.
yarn run dll:build --watch
```

### `dll:serve`

创建一个简单的 HTTP 服务器（没有实时重载机制），可以验证软件包的 DLL 构建是否与 CKEditor 5 [DLL构建](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) 兼容.

```bash
# 启动 HTTP 服务器并打开浏览器.
yarn run dll:serve
```

### `translations:collect`

收集翻译信息（`t()`函数的参数）和上下文文件，然后验证所提供的值是否与`@ckeditor/ckeditor5-core`包中指定的值冲突。

如果满足以下条件之一，该任务可能以错误结束。

* Found the `Unused context` error &ndash; 在`lang/contexts.json`文件中指定的条目不会被用于源文件。它们应该被删除.
* Found the `Context is duplicated for the id` error &ndash; 有些条目是重复的。考虑从`lang/contexts.json`文件中删除它们，或者重写它们.
* Found the `Context for the message id is missing` error &ndash; 源文件中指定的条目在`lang/contexts.json`文件中没有描述。它们应该被添加.

```bash
yarn run translations:collect
```

### `translations:download`

从 Transifex 服务器下载翻译。根据用户在项目中的活动，它创建用于建立编辑器的翻译文件。
该任务需要将 URL 传递给 Transifex API。通常情况下，它符合以下格式，`https://www.transifex.com/api/2/project/[project_slug]`。
为了避免每次调用命令时都传递 `--transifex` 选项，你可以把它存储在 `package.json` 中，在 `ckeditor5-package-tools translations:download` 后附加。

```bash
yarn run translations:download --transifex [API URL]
```

### `translations:upload`

将翻译信息上传到 Transifex 服务器。它允许使用 Transifex 平台的用户创建翻译到其他语言。
该任务需要将 URL 传递给 Transifex API，通常情况下，它符合以下格式，`https://www.transifex.com/api/2/project/[project_slug]`。
为了避免每次调用命令时都传递 `--transifex` 选项，你可以把它存储在 `package.json` 中，在 `ckeditor5-package-tools translations:upload` 后附加。

```bash
yarn run translations:upload --transifex [API URL]
```

## 3. 参考

[ckeditor github](https://github.com/ckeditor/ckeditor5)

[ckeditor generator](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/package-generator/using-package-generator.html)

[ckeditor example](https://ckeditor.com/docs/ckeditor5/latest/examples/index.html)

# 4. License

[MIT](https://opensource.org/licenses/MIT)











