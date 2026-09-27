import {
  LucideUsers, LucideTarget, LucideClock, LucideWallet,
  LucideChartBar, LucideCalculator, LucideFactory, LucidePackage,
  LucideCar, LucideTrendingUp, LucideMessageSquare, LucideFileText,
  LucideSmartphone, LucideBuilding2, LucideSearch, LucideLock,
  LucideLayers, LucidePuzzle, LucideShieldCheck,
  LucideHeadphones, LucideLanguages, LucideZap,LucideSettings, LucideGraduationCap, LucideRocket,
  LucideMail, LucidePhone, LucideMapPin
} from '@lucide/angular';
import { SOCIAL_ICONS } from './social-icons';
export const ICON_MAP: Record<string, any> = {
  'users':          LucideUsers,
  'target':         LucideTarget,
  'clock':          LucideClock,
  'wallet':         LucideWallet,
  'chart-bar':      LucideChartBar,
  'calculator':     LucideCalculator,
  'factory':        LucideFactory,
  'package':        LucidePackage,
  'car':            LucideCar,
  'trending-up':    LucideTrendingUp,
  'message-square': LucideMessageSquare,
  'file-text':      LucideFileText,
  'smartphone':     LucideSmartphone,
  'building-2':     LucideBuilding2,
  'search':         LucideSearch,
  'lock':           LucideLock,
  'layers':         LucideLayers,
  'puzzle':         LucidePuzzle,
  'shield-check':   LucideShieldCheck,
  'headphones':     LucideHeadphones,
  'languages':      LucideLanguages,
  'zap':            LucideZap,
  'settings':       LucideSettings,
  'graduation-cap': LucideGraduationCap,
  'rocket':         LucideRocket,
  'mail':           LucideMail,
  'phone':          LucidePhone,
  'map-pin':        LucideMapPin,
};

export function getIcon(name?: string | null): any {
  return name ? ICON_MAP[name] : undefined;
}
export const ALL_ICON_NAMES: string[] = [
  ...Object.keys(ICON_MAP),
  ...Object.keys(SOCIAL_ICONS)
];

export function isSocialIcon(name?: string | null): boolean {
  return !!name && name in SOCIAL_ICONS;
}

export function getSocialSvg(name?: string | null): string | null {
  return name ? SOCIAL_ICONS[name] ?? null : null;
}