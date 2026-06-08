import type { PlatformNavigationConfig } from "@/components/platform-shell"

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
    { id: "portal", label: "门户首页", href: "http://111.170.170.202:3001/portal", icon: "home" },
    { id: "workspace", label: "我的服务台", href: "http://111.170.170.202:3001/portal/workspace", icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: "http://111.170.170.202:3001/portal/apps", icon: "layoutGrid" },
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
    {
      id: "student-learning",
      label: "职业岗位查看",
      icon: "graduationCap",
      href: "/student.html",
      matchers: ["/student.html"],
    },
    {
      id: "ai-assisted",
      label: "AI 辅助版本",
      icon: "sparkles",
      children: [
        { id: "ai-assisted-positions", label: "岗位资源编辑(AI辅助)", href: "/ai-assisted/positions", matchers: ["/ai-assisted/positions"] },
        { id: "ai-assisted-batch", label: "批量岗位生成(AI辅助)", href: "/ai-assisted/positions/batch-generate", matchers: ["/ai-assisted/positions/batch-generate"] },
        { id: "ai-assisted-student", label: "职业岗位查看(AI辅助)", href: "/student-ai-assisted.html", matchers: ["/student-ai-assisted.html"] },
      ],
    },
    {
      id: "ai-assisted-2",
      label: "AI 辅助版本 V2",
      icon: "sparkles",
      children: [
        { id: "ai-assisted-2-positions", label: "岗位资源编辑(AI辅助V2)", href: "/ai-assisted_2/positions", matchers: ["/ai-assisted_2/positions"] },
      ],
    },
    {
      id: "ai-first",
      label: "AI 主导版本",
      icon: "sparkles",
      children: [
        { id: "ai-first-positions", label: "岗位资源编辑(AI主导)", href: "/ai-first/positions", matchers: ["/ai-first/positions"] },
        { id: "ai-first-batch", label: "批量岗位生成(AI主导)", href: "/ai-first/positions/batch-generate", matchers: ["/ai-first/positions/batch-generate"] },
        { id: "ai-first-student", label: "职业岗位查看(AI主导)", href: "/student-ai-first.html", matchers: ["/student-ai-first.html"] },
      ],
    },
  ],
}
