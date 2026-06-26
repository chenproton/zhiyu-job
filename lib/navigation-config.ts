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
    { id: "portal", label: "门户首页", href: "http://demo2.zhiyu.com.cn:3001/portal", icon: "home" },
    { id: "workspace", label: "我的服务台", href: "http://demo2.zhiyu.com.cn:3001/portal/workspace", icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: "http://demo2.zhiyu.com.cn:3001/portal/apps", icon: "layoutGrid" },
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
        { id: "banner-management", label: "轮播图管理", href: "/banner-management", matchers: ["/banner-management"] },
      ],
    },
    {
      id: "heart-jobs",
      label: "我的心仪岗位",
      icon: "heart",
      href: "/heart-jobs",
      matchers: ["/heart-jobs"],
    },
    {
      id: "learn-roads",
      label: "岗位学习路径管理",
      icon: "bookOpen",
      href: "/learn-roads",
      matchers: ["/learn-roads"],
    },
    {
      id: "post-recommend",
      label: "岗位目标推荐管理",
      icon: "lineChart",
      href: "/post-recommend",
      matchers: ["/post-recommend"],
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
      label: "AI 辅助功能",
      icon: "sparkles",
      children: [
        { id: "ai-assisted-2-positions", label: "岗位资源编辑(AI辅助)", href: "/ai-assisted_2/positions", matchers: ["/ai-assisted_2/positions"] },
        { id: "ai-batch-agent", label: "批量岗位创建(智能体)", href: "http://demo2.zhiyu.com.cn:5000/", external: true },
        { id: "ai-first-student", label: "学生岗位导览(AI辅助)", href: "/student-ai-first.html", matchers: ["/student-ai-first.html"] },
      ],
    },
  ],
}
