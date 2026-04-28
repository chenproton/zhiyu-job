import type { PlatformNavigationConfig } from "@my-app/platform-navigation-system"

export const careerNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "职业岗位学习平台",
  currentPlatformId: "career",
  currentPlatformLabel: "职业岗位学习平台",
  brandHref: "/dashboard",
  brandIcon: "briefcase",
  platformIcon: "briefcase",
  sideBackHref: "/dashboard",
  showCurrentTime: true,
  showUserMenu: false,
  topNavItems: [
    { id: "portal", label: "门户首页", href: "/dashboard", icon: "home", matchers: ["/dashboard"] },
    { id: "workspace", label: "我的服务台", href: "/approvals", icon: "briefcase", matchers: ["/approvals"] },
    { id: "apps", label: "应用服务中心", href: "/positions", icon: "layoutGrid", matchers: ["/positions", "/abilities", "/rules", "/batches", "/workflows"] },
  ],
  sideNavItems: [
    { id: "overview", label: "数据工作台", href: "/dashboard", icon: "barChart3", matchers: ["/dashboard"] },
    { id: "jobs", label: "岗位大厅", href: "/positions", icon: "briefcase", matchers: ["/positions"] },
    { id: "abilities", label: "能力公共池", href: "/abilities", icon: "layers3", matchers: ["/abilities"] },
    { id: "rules", label: "评价规则库", href: "/rules", icon: "bookOpen", matchers: ["/rules"] },
    { id: "operations", label: "建设运营", icon: "settings", children: [
      { id: "batches", label: "批次管理", href: "/batches", matchers: ["/batches"] },
      { id: "workflows", label: "审批流程管理", href: "/workflows", matchers: ["/workflows"] },
    ]},
    { id: "approvals", label: "审批中心", href: "/approvals", icon: "fileText", matchers: ["/approvals"] },
  ],
}
