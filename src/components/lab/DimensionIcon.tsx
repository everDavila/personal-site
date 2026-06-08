import {
  Lightbulb, Target, Layers, Code2, Cloud, BookOpen, Zap,
  Compass, FlaskConical, PenLine, Activity, LayoutGrid, Eye,
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
}

export const DIMENSION_LABELS: Record<string, string> = {
  'lightbulb':     'Idea',
  'target':        'Producto',
  'layers':        'Interfaz',
  'code-2':        'Implementación',
  'cloud':         'Infraestructura',
  'book-open':     'Aprendizaje',
  'zap':           'Hito',
  'compass':       'Investigación',
  'flask-conical': 'Testing',
  'pen-line':      'Contenido',
  'activity':      'Datos',
  'layout-grid':   'Diseño de sistema',
  'eye':           'Accesibilidad',
}

export function DimensionIcon({ dimension, size = 15 }: { dimension: string; size?: number }) {
  const Icon = ICONS[dimension] ?? Lightbulb
  return <Icon size={size} strokeWidth={1.5} />
}
