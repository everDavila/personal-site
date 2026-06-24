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

export const DIMENSION_MSG_KEY: Record<string, string> = {
  'lightbulb':     'dim_lightbulb',
  'target':        'dim_target',
  'layers':        'dim_layers',
  'code-2':        'dim_code',
  'cloud':         'dim_cloud',
  'book-open':     'dim_book',
  'zap':           'dim_zap',
  'compass':       'dim_compass',
  'flask-conical': 'dim_flask',
  'pen-line':      'dim_pen',
  'activity':      'dim_activity',
  'layout-grid':   'dim_grid',
  'eye':           'dim_eye',
  'route':         'dim_route',
}

export function DimensionIcon({ dimension, size = 15 }: { dimension: string; size?: number }) {
  const Icon = ICONS[dimension] ?? Lightbulb
  return <Icon size={size} strokeWidth={1.5} />
}
