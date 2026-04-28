# Annotation System - 集成指南

一个轻量级、可配置的 Figma-like 页面标注与评论协作系统，支持任意 Next.js 项目集成。

## 特性

- 页面任意位置点击创建标注点
- 标注点可拖拽移动（支持鼠标 + 触摸屏）
- 点击标注点查看详情与评论线程
- 支持评论回复（嵌套讨论）
- 标注按页面隔离
- 编辑 / 只读 / 关闭 三种模式
- 可自定义主题、z-index、API 路径
- 默认使用 JSON 文件存储，适合直接集成到本地 Next.js 项目
- 移动端适配（面板从底部滑出）
- 键盘快捷键支持（ESC 关闭面板/编辑器）

---

## 📦 安装

### 方式一：复制目录（推荐快速集成）

```bash
cp -r /path/to/annotation-system /your/project/packages/
```

在你的项目 `package.json` 中添加：

```json
{
  "dependencies": {
    "@my-app/annotation-system": "file:./packages/annotation-system"
  }
}
```

### 方式二：发布为 npm 包

```bash
cd packages/annotation-system
npm install
npm run build
npm publish --access public
```

然后安装：

```bash
npm install @my-app/annotation-system lucide-react date-fns
```

---

## 🚀 快速集成

### 1. 添加 API 路由

创建 `/app/api/annotations/route.ts`：

```typescript
export { GET, POST, PUT, DELETE } from '@my-app/annotation-system/api/annotations';
```

创建 `/app/api/comments/route.ts`：

```typescript
export { GET, POST, DELETE } from '@my-app/annotation-system/api/comments';
```

> 注意：这两个路由处理器默认使用包内置的 JSON 文件适配器，会把数据写到宿主项目的 `data/annotations.json`。如果你的部署环境没有可写磁盘，应该改用自定义适配器或自行实现路由层。

### 2. 在 Layout 中集成

修改 `app/layout.tsx`：

```tsx
import { AnnotationSystem } from '@my-app/annotation-system';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <AnnotationSystem />
      </body>
    </html>
  );
}
```

`AnnotationSystem` 是客户端组件，可以直接挂到 App Router 的服务端 `layout.tsx` 中；只要传入的是字符串、数字、布尔值、普通对象这类可序列化配置即可。

### 3. 添加 CSS（Tailwind CSS）

> **注意**：Tailwind CSS v3 和 v4 的配置方式不同，请根据你的版本选择对应方式。

#### Tailwind CSS v4

在 `app/globals.css` 中添加：

```css
@import "tailwindcss";
```

#### Tailwind CSS v3

确保 `tailwind.config.js` 中扫描到插件目录：

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/annotation-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
};
```

并在 CSS 入口文件引入 Tailwind：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 安装依赖

```bash
npm install lucide-react date-fns
```

> 如果你要单独构建 `annotation-system` 包本身，还需要在包目录安装它自己的开发依赖；否则 `npm run build` 可能会报 `tsup: command not found`。
当前版本使用包内自带的构建脚本产出 `dist`，不再依赖额外 bundler；但如果你要在独立仓库中发布或维护它，仍建议先在包目录执行一次 `npm install`。

---

## ⚙️ 配置选项

`AnnotationSystem` 组件支持以下 Props：

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | `string` | 自动检测 `pathname` | 页面标识，用于隔离不同页面的标注 |
| `apiBasePath` | `string` | `"/api"` | API 路由前缀 |
| `defaultMode` | `"off" \| "view" \| "edit"` | `"view"` | 默认模式 |
| `currentUser` | `string` | 从 localStorage 读取 | 当前用户名，接入外部 auth 系统时传入 |
| `zIndex` | `number` | `500` | 基础 z-index，所有内部层级在此基础上递增 |
| `theme` | `AnnotationTheme` | 见下表 | 主题配置 |
| `onModeChange` | `(mode) => void` | - | 模式变化回调 |

> 如果你需要传函数类配置，请优先在宿主项目里包一层客户端组件，再从该客户端组件里渲染 `AnnotationSystem`。

## ✅ 集成后建议执行的检查

```bash
npx tsc -p packages/annotation-system/tsconfig.json --noEmit
cd packages/annotation-system && npm run build
```

建议至少验证：

- 标注列表可以正常加载
- 新建标注与拖拽位置可以保存
- 评论与回复可以创建
- 删除父评论时，其回复会一起删除
- 在移动端宽度下评论面板能以底部抽屉样式打开

### 主题配置

```tsx
<AnnotationSystem
  theme={{
    primary: '#ef4444',   // 标注点主色
    secondary: '#3b82f6', // 查看模式按钮色
    danger: '#ef4444',    // 删除操作色
    dotSize: 32,          // 标注点直径（px）
    panelBg: '#ffffff',   // 面板背景色
    panelText: '#374151', // 面板文字色
  }}
/>
```

### 接入外部用户系统示例

```tsx
import { AnnotationSystem } from '@my-app/annotation-system';
import { useSession } from 'next-auth/react';

function AppLayout({ children }) {
  const { data: session } = useSession();

  return (
    <>
      {children}
      <AnnotationSystem
        currentUser={session?.user?.name ?? 'Anonymous'}
        defaultMode="view"
        theme={{ primary: '#3b82f6' }}
      />
    </>
  );
}
```

### 自定义 API 路径示例

```tsx
<AnnotationSystem
  apiBasePath="/api/review"
  page="/prototype/v2/dashboard"
/>
```

对应 API 路由文件：

```ts
// app/api/review/annotations/route.ts
export { GET, POST, PUT, DELETE } from '@my-app/annotation-system/api/annotations';
```

### 自定义数据文件路径

默认会把数据写到宿主项目的 `data/annotations.json`。如果你想把数据文件放到别的位置，可以配置环境变量：

```bash
ANNOTATION_SYSTEM_DATA_PATH=/var/app-data/annotations.json
```

---

## 🎯 使用说明

### 模式切换

| 模式 | 说明 |
|------|------|
| **Off** | 关闭所有标注显示 |
| **View** | 仅查看模式，可点击标注查看详情和评论 |
| **Edit** | 可新增、拖拽、编辑、删除标注和评论 |

### 创建标注

1. 切换到 **Edit** 模式
2. 点击页面任意位置创建标注
3. 在弹出的编辑器中输入内容
4. 点击 **Save** 保存

### 查看标注

1. 切换到 **View** 或 **Edit** 模式
2. 点击标注点查看详情和评论面板

### 拖拽标注

1. 切换到 **Edit** 模式
2. 按住标注点拖动到目标位置
3. 释放后自动保存位置

> 支持鼠标拖拽和触摸屏拖拽。

### 添加评论

1. 点击标注点打开评论面板
2. 在底部输入框中输入评论内容
3. 按 Enter 或点击发送按钮

### 回复评论

1. 点击评论下方的 **Reply** 按钮
2. 输入回复内容
3. 按 Enter 发送

### 编辑 / 删除标注

1. 切换到 **Edit** 模式
2. 点击标注点打开面板
3. 点击 **Edit** 或 **Delete** 按钮

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Esc` | 关闭评论面板 / 取消编辑器 |

---

## 🗄️ 数据存储

### 默认：JSON 文件存储

数据默认存储在 `data/annotations.json` 文件中：

```json
{
  "annotations": [],
  "comments": []
}
```

> ⚠️ 更适合本地开发或有可写磁盘的部署环境。像 Vercel 这类无状态文件系统环境，不适合用 JSON 文件持久化标注数据。

### 评论删除行为

删除一条评论时，系统会连带删除它的所有回复，避免残留不可见的孤儿评论。

---

## 📁 项目结构

```
packages/annotation-system/
├── components/                   # React 组件
│   ├── AnnotationSystem.tsx      # 主集成组件（配置入口）
│   ├── AnnotationLayer.tsx       # 标注层（渲染标注点 + 拖拽）
│   ├── AnnotationController.tsx  # 控制面板（模式切换 + 拖拽）
│   ├── AnnotationEditor.tsx      # 标注编辑器
│   └── CommentPanel.tsx          # 评论面板
├── hooks/
│   └── useAnnotations.ts         # 状态管理 Hook
├── lib/
│   ├── types.ts                  # TypeScript 类型定义
│   ├── adapter.ts                # 存储接口定义
│   └── adapters/
│       └── json-file.ts          # JSON 文件适配器实现
├── api/
│   ├── annotations.ts            # 标注 API 路由
│   └── comments.ts               # 评论 API 路由
├── index.ts                      # 导出文件
├── package.json                  # 包配置
├── scripts/build.mjs             # 本地构建脚本
├── tsconfig.json                 # TypeScript 配置
└── INTEGRATION.md                # 集成指南
```

---

## 🎨 自定义样式

你可以通过 `theme` Prop 或 CSS 自定义外观。

### 通过 theme Prop

```tsx
<AnnotationSystem
  theme={{
    primary: '#8b5cf6',
    secondary: '#10b981',
    dotSize: 28,
    panelBg: '#fafafa',
  }}
/>
```

### 通过 CSS 覆盖

标注系统使用带有 `ann-` 前缀的类名：

```css
.ann-dot {
  /* 自定义标注点样式 */
}

.ann-panel {
  /* 自定义面板样式 */
}

.ann-editor {
  /* 自定义编辑器样式 */
}
```

---

## 🔧 常见问题

### Q: 在 Vercel 上部署后标注数据丢失了？

A: 默认的 JSON 文件存储依赖可写磁盘，更适合本地开发或有持久化文件系统的环境。如果部署环境是无状态文件系统，标注数据无法长期保留。

### Q: 标注点被页面上的弹窗挡住了？

A: 通过 `zIndex` Prop 提高层级：

```tsx
<AnnotationSystem zIndex={9999} />
```

### Q: 评论删除后为什么要级联删除回复？

A: 回复和父评论组成一个线程。如果只删除父评论、不删除子回复，会在数据层留下无法正常展示的孤儿评论。当前版本已经默认做级联删除。

### Q: 如何禁用某些功能？

A: 目前可以通过 `mode` 控制。如需更细粒度控制（如只读模式下隐藏某些 UI），可通过 CSS 覆盖实现。

### Q: 支持多语言吗？

A: 当前版本默认文案以英文为主。建议在公司内复用时直接按统一语言策略改成中文或接入你们自己的 i18n 包装层。

---

## 🤝 团队协作扩展

系统设计支持扩展为团队协作系统：

1. **用户认证**：通过 `currentUser` Prop 接入 OAuth/JWT
2. **实时同步**：在 `AnnotationAdapter` 中集成 WebSocket 或 SSE
3. **权限管理**：在 API 路由中添加角色和权限校验
4. **数据库迁移**：替换 JSON 文件为 PostgreSQL / SQLite / MongoDB
5. **通知系统**：在 `createComment` 时触发邮件/站内通知
6. **图片存储**：将 Base64 图片替换为对象存储（S3 / OSS / Cloudflare R2）

---

## 📝 许可证

MIT License
