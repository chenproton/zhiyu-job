import { BadgeCheck, BarChart3, BookOpen, Briefcase, Calendar, FileText, FolderKanban, GraduationCap, Home, LayoutGrid, Layers3, LineChart, Settings, Share2, Sparkles, User, } from "lucide-react";
export const platformIconMap = {
    badgeCheck: BadgeCheck,
    barChart3: BarChart3,
    bookOpen: BookOpen,
    briefcase: Briefcase,
    calendar: Calendar,
    fileText: FileText,
    folderKanban: FolderKanban,
    graduationCap: GraduationCap,
    home: Home,
    layoutGrid: LayoutGrid,
    layers3: Layers3,
    lineChart: LineChart,
    settings: Settings,
    share2: Share2,
    sparkles: Sparkles,
    user: User,
};
export function resolvePlatformIcon(icon) {
    if (typeof icon === "string") {
        return platformIconMap[icon] || Settings;
    }
    return icon;
}
