# Platform Navigation System - 集成指南

一个可直接复用的后台导航系统，抽取自管理控制台的导航样式：

- 顶部导航：`门户首页` / `我的服务台` / `应用服务中心`
- 左侧导航：参考 `backend` 中系统设置模块的交互和视觉结构

适用于多平台后台系统快速统一导航样式，尤其适合在多个既有系统中统一导航骨架、只替换配置数据。

## 目录结构

```text
platform-navigation-shell/
  components/
  lib/
  templates/
  DESIGN.md
  index.ts
  package.json
```

## 安装方式

### 方式一：复制目录

```bash
cp -r /path/to/platform-navigation-shell /your/project/packages/
```

宿主项目 `package.json`：

```json
{
  "dependencies": {
    "@my-app/platform-navigation-system": "file:./packages/platform-navigation-shell"
  }
}
```

### 方式二：作为本地包构建

```bash
cd packages/platform-navigation-shell
npm install
npm run build
```

当前版本使用包内自带的构建脚本产出 `dist`，不依赖额外 bundler。只要宿主项目能解析 `typescript`，就可以完成构建。

## 快速接入

### 1. 在项目中引入导航壳

`PlatformShell` 是客户端组件。如果你在 Next.js App Router 中从 `layout.tsx` 这类服务端组件传入配置，推荐优先使用“可序列化配置”：

- 导航图标使用字符串键，如 `"home"`、`"settings"`、`"layoutGrid"`
- 避免把 `lucide-react` 图标组件对象从服务端直接作为 `config` 传给客户端

包内置的 `senceNavigationTemplate` 已经改成可序列化配置，可以直接在服务端布局里使用。

```tsx
import { PlatformShell } from "@my-app/platform-navigation-system"
import { sceneNavigationTemplate } from "@my-app/platform-navigation-system"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <PlatformShell config={sceneNavigationTemplate}>{children}</PlatformShell>
      </body>
    </html>
  )
}
```

### 2. 为目标平台创建一份自己的配置

推荐直接使用字符串图标键：

```tsx
import type { PlatformNavigationConfig } from "@my-app/platform-navigation-system"

export const careerNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "场景化数智教学服务平台",
  currentPlatformId: "career",
  currentPlatformLabel: "职业岗位学习平台",
  brandHref: "/",
  brandIcon: "settings",
  platformIcon: "briefcase",
  sideBackHref: "/",
  currentUserName: "管理员",
  currentUserRoleLabel: "职业岗位学习平台",
  topNavItems: [
    { id: "portal", label: "门户首页", href: "/dashboard", icon: "home", matchers: ["/dashboard"] },
    { id: "workspace", label: "我的服务台", href: "/workspace", icon: "briefcase", matchers: ["/workspace"] },
    { id: "apps", label: "应用服务中心", href: "/", icon: "layoutGrid", matchers: ["/", "/jobs"] },
  ],
  sideNavItems: [
    { id: "overview", label: "平台总览", href: "/dashboard", icon: "barChart3", matchers: ["/dashboard"] },
    { id: "jobs", label: "岗位资源管理", href: "/jobs", icon: "settings", matchers: ["/jobs"] },
  ],
}
```

如果你确实需要传入自定义 `lucide-react` 图标组件，建议把配置定义在客户端包装组件内部，再把包装组件挂到服务端布局中。

### 3. 可用图标键

当前内置图标键：

- `badgeCheck`
- `barChart3`
- `bookOpen`
- `briefcase`
- `calendar`
- `fileText`
- `folderKanban`
- `graduationCap`
- `home`
- `layoutGrid`
- `layers3`
- `lineChart`
- `settings`
- `share2`
- `sparkles`
- `user`

### 4. 常用可选配置

- `brandHref`: 左上角品牌点击跳转地址
- `brandIcon`: 顶部品牌图标
- `platformIcon`: 左侧平台标题图标
- `showCurrentTime`: 是否显示右上角时间
- `showUserMenu`: 是否显示右上角用户菜单
- `userMenuItems`: 用户菜单项
- `defaultExpandedSideNavIds`: 左侧默认展开分组
- `shellClassName` / `mainClassName` / `contentClassName`: 宿主项目自定义布局类名

### 5. 让 Tailwind 扫描到这个包

Tailwind v3 需要把包目录加入 `content`；Tailwind v4 只要宿主项目正常处理依赖源码即可。

```js
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./packages/platform-navigation-shell/**/*.{js,ts,jsx,tsx,mdx}",
]
```

### 6. 构建检查

推荐至少执行下面两步：

```bash
npx tsc -p packages/platform-navigation-shell/tsconfig.json --noEmit
cd packages/platform-navigation-shell && npm run build
```

如果只是在宿主项目中以源码方式直接消费这个包，类型检查通过通常就足够开始集成；如果要发布、归档或复用 `dist` 产物，再执行构建。

## 设计风格参考

为了让不同系统集成后仍保持统一的后台视觉语言，包内提供了一份中层设计基线：

- [DESIGN.md](./DESIGN.md)

建议在接入新系统时同时参考这份指南，优先统一：

- 导航骨架和内容区关系
- 主色、背景气质、排版层级
- 状态信息和重点信息的表达方式
- Hover / Active 的基本反馈方式

具体业务页里的卡片结构、模块排布、表格和图表组织方式可以自由发挥，不需要机械复用已有页面样式。

## 平台目录说明

`platformCatalog` 是一份起始目录数据，不是固定清单。

如果你的平台数量、命名或顺序和当前模板不同，建议直接在宿主系统中覆盖或扩展它，而不是强依赖内置列表。

## 对外导出

- `PlatformShell`
- `PlatformTopNav`
- `PlatformSideNav`
- `PlatformNavigationConfig`
- `PlatformIcon`
- `PlatformIconKey`
- `platformIconMap`
- `resolvePlatformIcon`
- `sceneNavigationTemplate`
- `senceNavigationTemplate`
- `platformCatalog`
