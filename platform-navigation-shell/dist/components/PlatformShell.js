"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformTopNav = PlatformTopNav;
exports.PlatformSideNav = PlatformSideNav;
exports.PlatformShell = PlatformShell;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const icons_1 = require("../lib/icons");
const utils_1 = require("../lib/utils");
function isTopItemActive(pathname, item) {
    return (0, utils_1.matchesPath)(pathname, item.href, item.matchers);
}
function isSideItemActive(pathname, item) {
    if (item.children?.length) {
        return item.children.some((child) => (0, utils_1.matchesPath)(pathname, child.href, child.matchers));
    }
    return (0, utils_1.matchesPath)(pathname, item.href, item.matchers);
}
const fallbackUserMenuItems = [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
];
function PlatformTopNav({ config, userMenuSlot }) {
    const pathname = (0, navigation_1.usePathname)();
    const [currentTime, setCurrentTime] = (0, react_1.useState)("");
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const [menuOpen, setMenuOpen] = (0, react_1.useState)(false);
    const menuRef = (0, react_1.useRef)(null);
    const BrandIcon = (0, icons_1.resolvePlatformIcon)(config.brandIcon || "settings");
    const userMenuItems = config.userMenuItems ?? fallbackUserMenuItems;
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        setMenuOpen(false);
    }, [pathname]);
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsxs)("header", { className: "fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-8", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: config.brandHref || "/", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary", children: (0, jsx_runtime_1.jsx)(BrandIcon, { className: "h-4 w-4 text-primary-foreground" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-base font-semibold text-gray-800", children: config.brandTitle })] }), (0, jsx_runtime_1.jsx)("nav", { className: "flex items-center gap-1", children: config.topNavItems.map((item) => {
                            const Icon = (0, icons_1.resolvePlatformIcon)(item.icon);
                            const active = isTopItemActive(pathname, item);
                            return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: (0, utils_1.cn)("relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm transition-colors", active ? "font-medium text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), item.label, active ? (0, jsx_runtime_1.jsx)("span", { className: "absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" }) : null] }, item.id));
                        }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [config.showCurrentTime !== false && mounted ? (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: currentTime }) : null, userMenuSlot ? (userMenuSlot) : config.showUserMenu !== false ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative", ref: menuRef, children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setMenuOpen((value) => !value), className: "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground", children: (config.currentUserName || "管理员").slice(0, 1) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-700", children: config.currentUserName || "管理员" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: config.currentUserRoleLabel || config.currentPlatformLabel })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-gray-400" })] }), menuOpen && userMenuItems.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg", children: userMenuItems.map((item, index) => {
                                    const Icon = item.icon ? (0, icons_1.resolvePlatformIcon)(item.icon) : null;
                                    const itemClassName = item.tone === "danger"
                                        ? "flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                        : "flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50";
                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [index > 0 && item.tone === "danger" ? (0, jsx_runtime_1.jsx)("div", { className: "my-1 h-px bg-gray-100" }) : null, item.href ? ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: itemClassName, children: [Icon ? (0, jsx_runtime_1.jsx)(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] })) : ((0, jsx_runtime_1.jsxs)("button", { type: "button", className: itemClassName, children: [Icon ? (0, jsx_runtime_1.jsx)(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] }))] }, item.id));
                                }) })) : null] })) : null] })] }));
}
function PlatformSideNav({ config }) {
    const pathname = (0, navigation_1.usePathname)();
    const defaultExpanded = (0, react_1.useMemo)(() => config.defaultExpandedSideNavIds?.length
        ? config.defaultExpandedSideNavIds
        : config.sideNavItems.filter((item) => item.children?.length).map((item) => item.id), [config.defaultExpandedSideNavIds, config.sideNavItems]);
    const [expandedItems, setExpandedItems] = (0, react_1.useState)(defaultExpanded);
    const PlatformIcon = (0, icons_1.resolvePlatformIcon)(config.platformIcon || "settings");
    (0, react_1.useEffect)(() => {
        const activeParents = config.sideNavItems
            .filter((item) => item.children?.some((child) => (0, utils_1.matchesPath)(pathname, child.href, child.matchers)))
            .map((item) => item.id);
        setExpandedItems((prev) => Array.from(new Set([...defaultExpanded, ...activeParents, ...prev])));
    }, [config.sideNavItems, defaultExpanded, pathname]);
    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => prev.includes(itemId) ? prev.filter((entry) => entry !== itemId) : [...prev, itemId]);
    };
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "sticky top-14 h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-gray-100 bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-100 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: config.sideBackHref, className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-primary/10 hover:text-primary", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(PlatformIcon, { className: "h-4 w-4 text-primary" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-800", children: config.currentPlatformLabel })] })] }) }), (0, jsx_runtime_1.jsx)("nav", { className: "p-3", children: config.sideNavItems.map((item) => {
                    const Icon = (0, icons_1.resolvePlatformIcon)(item.icon);
                    const hasChildren = Boolean(item.children?.length);
                    const active = isSideItemActive(pathname, item);
                    const isExpanded = expandedItems.includes(item.id);
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-1", children: [hasChildren ? ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => toggleExpand(item.id), className: (0, utils_1.cn)("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary/5 font-medium text-primary" : "text-gray-600 hover:bg-gray-50"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), item.label] }), isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-gray-400" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4 text-gray-400" }))] })) : ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href || "/", className: (0, utils_1.cn)("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary text-white font-medium" : "text-gray-600 hover:bg-gray-50"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), item.label] })), hasChildren && isExpanded ? ((0, jsx_runtime_1.jsx)("div", { className: "ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3", children: (() => {
                                    // 找出所有匹配的子菜单，选择 href 最长的作为最佳匹配（最精确）
                                    const matchedChildren = item.children?.filter((child) => (0, utils_1.matchesPath)(pathname, child.href, child.matchers)) || [];
                                    const bestMatch = matchedChildren.reduce((best, child) => {
                                        if (!best)
                                            return child;
                                        return (child.href?.length || 0) > (best.href?.length || 0)
                                            ? child
                                            : best;
                                    }, null);
                                    return item.children?.map((child) => {
                                        const isChildActive = bestMatch?.id === child.id;
                                        const childClassName = (0, utils_1.cn)("block rounded-lg px-3 py-2 text-sm transition-colors", isChildActive
                                            ? "bg-primary text-white font-medium"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800");
                                        if (child.external) {
                                            return ((0, jsx_runtime_1.jsx)("a", { href: child.href, target: "_blank", rel: "noopener noreferrer", className: childClassName, children: child.label }, child.id));
                                        }
                                        return ((0, jsx_runtime_1.jsx)(link_1.default, { href: child.href, className: childClassName, children: child.label }, child.id));
                                    });
                                })() })) : null] }, item.id));
                }) })] }));
}
function PlatformShell({ config, children, userMenuSlot, }) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(PlatformTopNav, { config: config, userMenuSlot: userMenuSlot }), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex min-h-screen bg-[#f5f7fa] pt-14", config.shellClassName), children: [(0, jsx_runtime_1.jsx)(PlatformSideNav, { config: config }), (0, jsx_runtime_1.jsx)("main", { className: (0, utils_1.cn)("min-w-0 flex-1", config.mainClassName), children: (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("p-6", config.contentClassName), children: children }) })] })] }));
}
