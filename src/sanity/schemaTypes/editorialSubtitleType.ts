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

const LANGUAGE_OPTIONS = [
  { title: 'Spanish (es)', value: 'es' },
  { title: 'English (en)', value: 'en' },
  { title: 'Portuguese (pt)', value: 'pt' },
  { title: 'Quechua (qu)', value: 'qu' },
  { title: 'Chinese (zh)', value: 'zh' },
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
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
      description: 'Each language has its own editorial voice. This is not a translation.',
      options: { list: LANGUAGE_OPTIONS },
    }),
    defineField({
      name: 'text',
      title: 'Subtitle text',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Leave empty to create an intentional silent state — no subtitle shows on this selection.',
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      options: { layout: 'tags' },
      description: 'Editorial reference only. Has no effect on selection.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      options: { layout: 'tags' },
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
      description: 'Used when rotation is "Weighted". Higher = more likely. Set to 0 for a rare silent state.',
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
      description: 'Empty = any time. Select to restrict to specific time slots.',
      options: { list: TIME_OPTIONS },
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      description: 'Empty = any season. Based on Southern hemisphere calendar (Lima, Peru).',
      options: { list: SEASON_OPTIONS },
    }),
    defineField({
      name: 'weather',
      title: 'Weather',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      description: 'Empty = any weather. Stored for future integration — not active yet.',
      options: { list: WEATHER_OPTIONS },
    }),
    defineField({
      name: 'mood',
      title: 'Mood',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'context',
      options: { layout: 'tags' },
      description: 'Editorial mood label. Stored for future use — not active yet.',
    }),
  ],
  orderings: [
    {
      title: 'Page, then language',
      name: 'pageLanguage',
      by: [{ field: 'page', direction: 'asc' }, { field: 'language', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      text: 'text',
      page: 'page',
      language: 'language',
      active: 'active',
      archived: 'archived',
      rotation: 'rotation',
    },
    prepare({ text, page, language, active, archived, rotation }) {
      const flag = archived ? '[archived]' : !active ? '[inactive]' : ''
      const mode = rotation ? ` · ${rotation}` : ''
      return {
        title: text || '(silent state)',
        subtitle: `${flag} ${page} · ${language}${mode}`.trim(),
      }
    },
  },
})
