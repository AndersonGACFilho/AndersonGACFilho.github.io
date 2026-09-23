import type { Lang, UIKey } from '../i18n/ui';

export const TRACKS = ['fullstack', 'gamedev', 'research'] as const;
export type Track = (typeof TRACKS)[number];

/** Each track owns a colour; badges, card borders and filters all read from here. */
export const trackColor: Record<Track, string> = {
  fullstack: 'var(--fullstack)',
  gamedev: 'var(--gamedev)',
  research: 'var(--research)',
};

export const trackLabelKey = (t: Track): UIKey => `track.${t}` as UIKey;
export const trackDescKey = (t: Track): UIKey => `track.${t}.desc` as UIKey;

export function pick<T>(value: { en: T; pt: T }, lang: Lang): T {
  return value[lang] ?? value.en;
}
