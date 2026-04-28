import type { PlatformIcon } from "./icons"

export interface PlatformCatalogItem {
  id: string
  label: string
  icon: PlatformIcon
}

export interface TopNavItem {
  id: string
  label: string
  href: string
  icon: PlatformIcon
  matchers?: string[]
}

export interface SideNavChild {
  id: string
  label: string
  href: string
  matchers?: string[]
}

export interface SideNavItem {
  id: string
  label: string
  icon: PlatformIcon
  href?: string
  matchers?: string[]
  children?: SideNavChild[]
}

export interface UserMenuItem {
  id: string
  label: string
  href?: string
  icon?: PlatformIcon
  tone?: "default" | "danger"
}

export interface PlatformNavigationConfig {
  brandTitle: string
  currentPlatformId: string
  currentPlatformLabel: string
  sideBackHref: string
  brandHref?: string
  brandIcon?: PlatformIcon
  platformIcon?: PlatformIcon
  topNavItems: TopNavItem[]
  sideNavItems: SideNavItem[]
  currentUserName?: string
  currentUserRoleLabel?: string
  showUserMenu?: boolean
  userMenuItems?: UserMenuItem[]
  showCurrentTime?: boolean
  defaultExpandedSideNavIds?: string[]
  shellClassName?: string
  mainClassName?: string
  contentClassName?: string
}
