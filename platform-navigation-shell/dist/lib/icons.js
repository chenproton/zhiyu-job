"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformIconMap = void 0;
exports.resolvePlatformIcon = resolvePlatformIcon;
const lucide_react_1 = require("lucide-react");
exports.platformIconMap = {
    badgeCheck: lucide_react_1.BadgeCheck,
    barChart3: lucide_react_1.BarChart3,
    bookOpen: lucide_react_1.BookOpen,
    briefcase: lucide_react_1.Briefcase,
    calendar: lucide_react_1.Calendar,
    fileText: lucide_react_1.FileText,
    folderKanban: lucide_react_1.FolderKanban,
    graduationCap: lucide_react_1.GraduationCap,
    home: lucide_react_1.Home,
    layoutGrid: lucide_react_1.LayoutGrid,
    layers3: lucide_react_1.Layers3,
    lineChart: lucide_react_1.LineChart,
    settings: lucide_react_1.Settings,
    share2: lucide_react_1.Share2,
    sparkles: lucide_react_1.Sparkles,
    user: lucide_react_1.User,
};
function resolvePlatformIcon(icon) {
    if (typeof icon === "string") {
        return exports.platformIconMap[icon] || lucide_react_1.Settings;
    }
    return icon;
}
