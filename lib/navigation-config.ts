import type { PlatformNavigationConfig } from "@my-app/platform-navigation-system"

export const careerNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "职业岗位学习平台",
  currentPlatformId: "career",
  currentPlatformLabel: "职业岗位学习平台",
  brandHref: "/positions",
  brandIcon: "briefcase",
  platformIcon: "briefcase",
  sideBackHref: "/positions",
  showCurrentTime: true,
  showUserMenu: false,
  topNavItems: [
    { id: "portal", label: "门户首页", href: "http://47.251.48.187:3001/portal", icon: "home" },
    { id: "workspace", label: "我的服务台", href: "http://47.251.48.187:3001/portal/workspace", icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: "http://47.251.48.187:3001/portal/apps", icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "job-construction",
      label: "岗位建设管理",
      icon: "briefcase",
      children: [
        { id: "positions", label: "岗位资源管理", href: "/positions", matchers: ["/positions"] },
        { id: "batches", label: "批次分组管理", href: "/batches", matchers: ["/batches"] },
        { id: "workflows", label: "审批流程管理", href: "/workflows", matchers: ["/workflows"] },
        { id: "approvals", label: "资源审批管理", href: "/approvals", matchers: ["/approvals"] },
      ],
    },
  ],
}
