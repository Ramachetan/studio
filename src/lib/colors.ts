export const PERSON_COLORS = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-indigo-400',
  'bg-pink-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-teal-400',
  'bg-cyan-400',
];

export function getNextColor(currentIndex: number): string {
  return PERSON_COLORS[currentIndex % PERSON_COLORS.length];
}
