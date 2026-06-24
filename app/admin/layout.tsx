import { PlatformShellWrapper } from '@/components/shared/platform-shell-wrapper'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PlatformShellWrapper>{children}</PlatformShellWrapper>
}
