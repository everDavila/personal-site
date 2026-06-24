import {
  Lightbulb, Target, Layers, Code2, Cloud, BookOpen, Zap,
  Compass, FlaskConical, PenLine, Activity, LayoutGrid, Eye, Route,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  'lightbulb':     Lightbulb,
  'target':        Target,
  'layers':        Layers,
  'code-2':        Code2,
  'cloud':         Cloud,
  'book-open':     BookOpen,
  'zap':           Zap,
  'compass':       Compass,
  'flask-conical': FlaskConical,
  'pen-line':      PenLine,
  'activity':      Activity,
  'layout-grid':   LayoutGrid,
  'eye':           Eye,
  'route':         Route,
}

export function DimensionIcon({ icon, size = 15 }: { icon: string; size?: number }) {
  const Icon = ICONS[icon] ?? Lightbulb
  return <Icon size={size} strokeWidth={1.5} />
}
