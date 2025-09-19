export const COUNTRIES = [
  'Russia', 'USA', 'United Kingdom', 'Germany', 'France', 'Spain',
  'Italy', 'China', 'Japan', 'South Korea', 'Brazil', 'Canada',
  'Australia', 'Netherlands', 'Sweden', 'Poland', 'Turkey', 'India'
] as const;

export type Country = typeof COUNTRIES[number];
