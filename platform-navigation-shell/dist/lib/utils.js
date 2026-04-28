"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.matchesPath = matchesPath;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function matchesPath(pathname, href, matchers) {
    const targets = matchers && matchers.length > 0 ? matchers : href ? [href] : [];
    return targets.some((target) => {
        if (target === "/") {
            return pathname === "/";
        }
        return pathname === target || pathname.startsWith(`${target}/`);
    });
}
