export type StatusIndicatorVariant = 'icon' | 'shape' | 'badge'
export type StatusIndicatorSize = 'medium' | 'small'
export type StatusIndicatorTone = 'error' | 'warning' | 'success' | 'info' | 'neutral' | 'accent'
export type StatusIndicatorShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon'

export interface StatusIndicatorPreset {
  readonly tone: StatusIndicatorTone
  readonly icon: string
  readonly label: string
  readonly shape: StatusIndicatorShape
}

export interface ResolveStatusIndicatorOptions {
  readonly status?: string | null
  readonly tone?: StatusIndicatorTone | null
  readonly icon?: string | null
  readonly label?: string | null
}

export const STATUS_INDICATOR_PRESETS: Readonly<Record<string, StatusIndicatorPreset>> = {
  failed: {
    tone: 'error',
    icon: 'error',
    label: 'Failed',
    shape: 'diamond',
  },
  'caution-major': {
    tone: 'warning',
    icon: 'warning',
    label: 'Caution major',
    shape: 'triangle',
  },
  'caution-minor': {
    tone: 'warning',
    icon: 'warning',
    label: 'Caution minor',
    shape: 'triangle',
  },
  undefined: {
    tone: 'accent',
    icon: 'help',
    label: 'Undefined',
    shape: 'hexagon',
  },
  succeeded: {
    tone: 'success',
    icon: 'check_circle',
    label: 'Succeeded',
    shape: 'circle',
  },
  normal: {
    tone: 'info',
    icon: 'info',
    label: 'Normal',
    shape: 'square',
  },
  'in-progress': {
    tone: 'info',
    icon: 'clock_loader_40',
    label: 'In progress',
    shape: 'square',
  },
  incomplete: {
    tone: 'info',
    icon: 'radio_button_unchecked',
    label: 'Incomplete',
    shape: 'square',
  },
  'not-started': {
    tone: 'neutral',
    icon: 'pending',
    label: 'Not started',
    shape: 'hexagon',
  },
  pending: {
    tone: 'neutral',
    icon: 'schedule',
    label: 'Pending',
    shape: 'hexagon',
  },
  unknown: {
    tone: 'neutral',
    icon: 'help',
    label: 'Unknown',
    shape: 'hexagon',
  },
  informative: {
    tone: 'info',
    icon: 'info',
    label: 'Informative',
    shape: 'square',
  },
  critical: {
    tone: 'error',
    icon: 'error',
    label: 'Critical',
    shape: 'diamond',
  },
  high: {
    tone: 'error',
    icon: 'priority_high',
    label: 'High',
    shape: 'diamond',
  },
  medium: {
    tone: 'warning',
    icon: 'warning',
    label: 'Medium',
    shape: 'triangle',
  },
  low: {
    tone: 'warning',
    icon: 'warning',
    label: 'Low',
    shape: 'triangle',
  },
  stable: {
    tone: 'success',
    icon: 'check_circle',
    label: 'Stable',
    shape: 'circle',
  },
  draft: {
    tone: 'neutral',
    icon: 'edit',
    label: 'Draft',
    shape: 'hexagon',
  },
  review: {
    tone: 'info',
    icon: 'autorenew',
    label: 'Review',
    shape: 'square',
  },
  published: {
    tone: 'success',
    icon: 'check_circle',
    label: 'Published',
    shape: 'circle',
  },
  rejected: {
    tone: 'error',
    icon: 'block',
    label: 'Rejected',
    shape: 'diamond',
  },
  completed: {
    tone: 'success',
    icon: 'check_circle',
    label: 'Completed',
    shape: 'circle',
  },
}

const TONE_DEFAULTS: Readonly<Record<StatusIndicatorTone, StatusIndicatorPreset>> = {
  error: {
    tone: 'error',
    icon: 'error',
    label: 'Error',
    shape: 'diamond',
  },
  warning: {
    tone: 'warning',
    icon: 'warning',
    label: 'Warning',
    shape: 'triangle',
  },
  success: {
    tone: 'success',
    icon: 'check_circle',
    label: 'Success',
    shape: 'circle',
  },
  info: {
    tone: 'info',
    icon: 'info',
    label: 'Info',
    shape: 'square',
  },
  neutral: {
    tone: 'neutral',
    icon: 'help',
    label: 'Neutral',
    shape: 'hexagon',
  },
  accent: {
    tone: 'accent',
    icon: 'help',
    label: 'Accent',
    shape: 'hexagon',
  },
}

export function normalizeStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function humanizeStatus(status: string): string {
  return normalizeStatus(status)
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export function resolveStatusIndicator(options: ResolveStatusIndicatorOptions): StatusIndicatorPreset {
  const normalizedStatus = options.status ? normalizeStatus(options.status) : ''
  const statusPreset = normalizedStatus ? STATUS_INDICATOR_PRESETS[normalizedStatus] : undefined
  const tonePreset = options.tone ? TONE_DEFAULTS[options.tone] : undefined

  const fallback = tonePreset ?? statusPreset ?? TONE_DEFAULTS.info

  return {
    tone: options.tone ?? statusPreset?.tone ?? fallback.tone,
    icon: options.icon?.trim() || statusPreset?.icon || fallback.icon,
    label:
      options.label?.trim() ||
      statusPreset?.label ||
      (normalizedStatus ? humanizeStatus(normalizedStatus) : fallback.label),
    shape: statusPreset?.shape ?? fallback.shape,
  }
}

export function formatStatusIndicatorCount(count: number): string {
  if (!Number.isFinite(count) || count <= 0) {
    return ''
  }

  if (count > 999) {
    return '999+'
  }

  return `${Math.floor(count)}`
}
