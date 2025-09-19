export const INTERESTS = [
  'Travel', 'Movies', 'Music', 'Sports', 'Cooking', 'Books',
  'Art', 'Technology', 'Photography', 'Gaming', 'Fashion', 'History',
  'Science', 'Nature', 'Dancing', 'Yoga'
] as const;

export type Interest = typeof INTERESTS[number];
