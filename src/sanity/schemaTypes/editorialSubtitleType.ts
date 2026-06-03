import { defineField, defineType } from 'sanity'

const PAGE_OPTIONS = [
  { title: 'Home', value: 'home' },
  { title: 'Work', value: 'work' },
  { title: 'Experience', value: 'experience' },
  { title: 'Blog', value: 'blog' },
  { title: 'Playground', value: 'playground' },
  { title: 'Contact', value: 'contact' },
  { title: 'About', value: 'about' },
]

const TIME_OPTIONS = [
  { title: 'Morning (5–12)', value: 'morning' },
  { title: 'Afternoon (12–18)', value: 'afternoon' },
  { title: 'Evening (18–22)', value: 'evening' },
  { title: 'Night (22–5)', value: 'night' },
]

// Southern hemisphere seasons (Peru)
const SEASON_OPTIONS = [
  { title: 'Summer (Dec–Feb)', value: 'summer' },
  { title: 'Autumn (Mar–May)', value: 'autumn' },
  { title: 'Winter (Jun–Aug)', value: 'winter' },
  { title: 'Spring (Sep–Nov)', value: 'spring' },
]

const WEATHER_OPTIONS = [
  { title: 'Clear', value: 'clear' },
  { title: 'Cloudy', value: 'cloudy' },
  { title: 'Rainy', value: 'rainy' },
  { title: 'Stormy', value: 'stormy' },
]

export const editorialSubtitleType = defineType({
  name: 'editorialSubtitle',
  title: 'Editorial Subtitle',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'behavior', title: 'Behavior' },
    { name: 'context', title: 'Context conditions' },
  ],
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
      options: { list: PAGE_OPTIONS },
    }),
    defineField({
      name: 'text',
      title: 'Subtitle text',
      type: 'localizedString',
      group: 'content',
      description: 'One entry per language. Leave a language empty to fall back to the next available. Leave all empty for an intentional silent state.',
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      options: { layout: 'tags' },
      description: 'Editorial reference only.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'mode',
      title: 'Narrative mode',
      type: 'string',
      group: 'behavior',
      initialValue: 'any',
      description: 'Restrict this subtitle to a specific narrative mode, or show in both.',
      options: {
        list: [
          { title: 'Any mode (dark + light)', value: 'any' },
          { title: '🌑 Dark only',            value: 'dark'  },
          { title: '☀️ Light only',           value: 'light' },
        ],
        layout: 'radio',
      },
    }),

    // Behavior
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'behavior',
      initialValue: true,
    }),
    defineField({
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      group: 'behavior',
      initialValue: false,
      description: 'Archived subtitles are never deleted — just removed from rotation.',
    }),
    defineField({
      name: 'rotation',
      title: 'Rotation mode',
      type: 'string',
      group: 'behavior',
      initialValue: 'random',
      options: {
        list: [
          { title: 'Random — included in random pool', value: 'random' },
          { title: 'Weighted — random, but uses weight value', value: 'weighted' },
          { title: 'Daily — same subtitle all day (date-seeded)', value: 'daily' },
          { title: 'Manual — always shown when active (pinned)', value: 'manual' },
        ],
      },
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'number',
      group: 'behavior',
      initialValue: 1,
      description: 'Higher = more likely to be selected. 0 = silent state entry.',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'startDate',
      title: 'Active from',
      type: 'date',
      group: 'behavior',
      description: 'Leave empty to always be active.',
    }),
    defineField({
      name: 'endDate',
      title: 'Active until',
      type: 'date',
      group: 'behavior',
      description: 'Leave empty to never expire.',
    }),
    // Context conditions
    defineField({
      name: 'time',
      title: 'Time of day',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      description: 'Empty = any time.',
      options: { list: TIME_OPTIONS },
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      description: 'Empty = any season. Southern hemisphere calendar (Lima, Peru).',
      options: { list: SEASON_OPTIONS },
    }),
    defineField({
      name: 'weather',
      title: 'Weather',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      description: 'Empty = any weather. Future integration — not active yet.',
      options: { list: WEATHER_OPTIONS },
    }),
    defineField({
      name: 'mood',
      title: 'Mood',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      options: { layout: 'tags' },
      description: 'Editorial reference. Not active yet.',
    }),
  ],
  orderings: [
    {
      title: 'By page',
      name: 'byPage',
      by: [{ field: 'page', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      text: 'text',
      page: 'page',
      active: 'active',
      archived: 'archived',
      rotation: 'rotation',
    },
    prepare({ text, page, active, archived, rotation }) {
      const title = text?.es || text?.en || text?.pt || '(silent state)'
      const flag = archived ? '· archived' : !active ? '· inactive' : ''
      const mode = rotation && rotation !== 'random' ? ` · ${rotation}` : ''
      return {
        title,
        subtitle: `${page}${mode} ${flag}`.trim(),
      }
    },
  },
})
