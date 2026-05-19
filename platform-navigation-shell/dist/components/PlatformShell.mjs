"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { resolvePlatformIcon } from "../lib/icons.mjs";
import { cn, matchesPath } from "../lib/utils.mjs";
function isTopItemActive(pathname, item) {
    return matchesPath(pathname, item.href, item.matchers);
}
function isSideItemActive(pathname, item) {
    if (item.children?.length) {
        return item.children.some((child) => matchesPath(pathname, child.href, child.matchers));
    }
    return matchesPath(pathname, item.href, item.matchers);
}
const fallbackUserMenuItems = [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
];
export function PlatformTopNav({ config, userMenuSlot }) {
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState("");
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const BrandIcon = resolvePlatformIcon(config.brandIcon || "settings");
    const userMenuItems = config.userMenuItems ?? fallbackUserMenuItems;
    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const weekDay = weekDays[now.getDay()];
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            setCurrentTime(`${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (_jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Link, { href: config.brandHref || "/", className: "flex items-center gap-2", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary", children: _jsx(BrandIcon, { className: "h-4 w-4 text-primary-foreground" }) }), _jsx("span", { className: "text-base font-semibold text-gray-800", children: config.brandTitle })] }), _jsx("nav", { className: "flex items-center gap-1", children: config.topNavItems.map((item) => {
                            const Icon = resolvePlatformIcon(item.icon);
                            const active = isTopItemActive(pathname, item);
                            return (_jsxs(Link, { href: item.href, className: cn("relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm transition-colors", active ? "font-medium text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"), children: [_jsx(Icon, { className: "h-4 w-4" }), item.label, active ? _jsx("span", { className: "absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" }) : null] }, item.id));
                        }) })] }), _jsxs("div", { className: "flex items-center gap-6", children: [config.showCurrentTime !== false && mounted ? _jsx("div", { className: "text-sm text-gray-400", children: currentTime }) : null, userMenuSlot ? (userMenuSlot) : config.showUserMenu !== false ? (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { type: "button", onClick: () => setMenuOpen((value) => !value), className: "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground", children: (config.currentUserName || "管理员").slice(0, 1) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm text-gray-700", children: config.currentUserName || "管理员" }), _jsx("div", { className: "text-xs text-gray-400", children: config.currentUserRoleLabel || config.currentPlatformLabel })] }), _jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })] }), menuOpen && userMenuItems.length > 0 ? (_jsx("div", { className: "absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg", children: userMenuItems.map((item, index) => {
                                    const Icon = item.icon ? resolvePlatformIcon(item.icon) : null;
                                    const itemClassName = item.tone === "danger"
                                        ? "flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                        : "flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50";
                                    return (_jsxs("div", { children: [index > 0 && item.tone === "danger" ? _jsx("div", { className: "my-1 h-px bg-gray-100" }) : null, item.href ? (_jsxs(Link, { href: item.href, className: itemClassName, children: [Icon ? _jsx(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] })) : (_jsxs("button", { type: "button", className: itemClassName, children: [Icon ? _jsx(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] }))] }, item.id));
                                }) })) : null] })) : null] })] }));
}
export function PlatformSideNav({ config }) {
    const pathname = usePathname();
    const defaultExpanded = useMemo(() => config.defaultExpandedSideNavIds?.length
        ? config.defaultExpandedSideNavIds
        : config.sideNavItems.filter((item) => item.children?.length).map((item) => item.id), [config.defaultExpandedSideNavIds, config.sideNavItems]);
    const [expandedItems, setExpandedItems] = useState(defaultExpanded);
    const PlatformIcon = resolvePlatformIcon(config.platformIcon || "settings");
    useEffect(() => {
        const activeParents = config.sideNavItems
            .filter((item) => item.children?.some((child) => matchesPath(pathname, child.href, child.matchers)))
            .map((item) => item.id);
        setExpandedItems((prev) => Array.from(new Set([...defaultExpanded, ...activeParents, ...prev])));
    }, [config.sideNavItems, defaultExpanded, pathname]);
    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => prev.includes(itemId) ? prev.filter((entry) => entry !== itemId) : [...prev, itemId]);
    };
    return (_jsxs("aside", { className: "sticky top-14 h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-gray-100 bg-white", children: [_jsx("div", { className: "border-b border-gray-100 p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { href: config.sideBackHref, className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-primary/10 hover:text-primary", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(PlatformIcon, { className: "h-4 w-4 text-primary" }), _jsx("h2", { className: "text-sm font-medium text-gray-800", children: config.currentPlatformLabel })] })] }) }), _jsx("nav", { className: "p-3", children: config.sideNavItems.map((item) => {
                    const Icon = resolvePlatformIcon(item.icon);
                    const hasChildren = Boolean(item.children?.length);
                    const active = isSideItemActive(pathname, item);
                    const isExpanded = expandedItems.includes(item.id);
                    return (_jsxs("div", { className: "mb-1", children: [hasChildren ? (_jsxs("button", { type: "button", onClick: () => toggleExpand(item.id), className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary/5 font-medium text-primary" : "text-gray-600 hover:bg-gray-50"), children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] }), isExpanded ? (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })) : (_jsx(ChevronRight, { className: "h-4 w-4 text-gray-400" }))] })) : (_jsxs(Link, { href: item.href || "/", className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary text-white font-medium" : "text-gray-600 hover:bg-gray-50"), children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] })), hasChildren && isExpanded ? (_jsx("div", { className: "ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3", children: (() => {
                                    // 找出所有匹配的子菜单，选择 href 最长的作为最佳匹配（最精确）
                                    const matchedChildren = item.children?.filter((child) => matchesPath(pathname, child.href, child.matchers)) || [];
                                    const bestMatch = matchedChildren.reduce((best, child) => {
                                        if (!best)
                                            return child;
                                        return (child.href?.length || 0) > (best.href?.length || 0)
                                            ? child
                                            : best;
                                    }, null);
                                    return item.children?.map((child) => {
                                        const isChildActive = bestMatch?.id === child.id;
                                        const childClassName = cn("block rounded-lg px-3 py-2 text-sm transition-colors", isChildActive
                                            ? "bg-primary text-white font-medium"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800");
                                        if (child.external) {
                                            return (_jsx("a", { href: child.href, target: "_blank", rel: "noopener noreferrer", className: childClassName, children: child.label }, child.id));
                                        }
                                        return (_jsx(Link, { href: child.href, className: childClassName, children: child.label }, child.id));
                                    });
                                })() })) : null] }, item.id));
                }) })] }));
}
export function PlatformShell({ config, children, userMenuSlot, }) {
    return (_jsxs(_Fragment, { children: [_jsx(PlatformTopNav, { config: config, userMenuSlot: userMenuSlot }), _jsxs("div", { className: cn("flex min-h-screen bg-[#f5f7fa] pt-14", config.shellClassName), children: [_jsx(PlatformSideNav, { config: config }), _jsx("main", { className: cn("min-w-0 flex-1", config.mainClassName), children: _jsx("div", { className: cn("p-6", config.contentClassName), children: children }) })] })] }));
}
