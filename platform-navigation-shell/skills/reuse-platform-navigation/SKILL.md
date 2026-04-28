---
name: reuse-platform-navigation
description: Reuse the backend-style top navigation and system-setting side navigation across platform apps by copying the shared shell and swapping only the config data.
---

# Reuse Platform Navigation

## Purpose

Use this skill when a platform app needs to adopt the unified navigation structure from the management console:

- Top navigation: `门户首页` / `我的服务台` / `应用服务中心`
- Side navigation style: the same interaction pattern used by the backend `系统设置` module

## Canonical reference

The reusable package implementation lives in this plugin:

- `platform-navigation-shell/components/PlatformShell.tsx`
- `platform-navigation-shell/lib/config.ts`
- `platform-navigation-shell/templates/sence-navigation.ts`
- `platform-navigation-shell/DESIGN.md`

When integrating into a Next.js App Router project, prefer serializable config values:

- Use built-in string icon keys such as `"home"` and `"settings"`
- Avoid passing raw icon component functions from a server component into `PlatformShell`

## Reuse workflow

1. Install or copy the plugin package into the target project.
2. Reuse `PlatformShell` from the plugin package.
3. Create a platform-specific config file beside the host app or copy from `templates/`.
4. Keep the top navigation labels unchanged unless the user explicitly asks to rename them.
5. Replace only the side navigation config, active-path matchers, brand text, icon keys, and back-link target.
6. Wire the shell into the app root layout so the page content renders inside the shared container.
7. When refreshing existing pages, keep their business content but align page width, title area, card usage, and status colors with `DESIGN.md`.

## Platform targets

Apply this shell to these platforms unless the user says otherwise:

- 职业岗位学习平台
- 实践场景学习平台
- 能力测评认证平台
- 数字课程服务平台
- AI服务平台
- 教学资源共享服务平台
- 教科研服务平台
- 教务服务平台
- 决策支持平台
- 就业服务平台

## Notes

- Prefer configuration changes over component rewrites.
- Preserve the visual style from `backend/components/portal/top-nav.tsx` and `backend/app/portal/apps/system/layout.tsx`.
- Do not migrate system-management business pages unless the request explicitly includes those modules.
