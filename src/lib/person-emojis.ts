export const PERSON_EMOJIS = [
  '😀', '😎', '😂', '🥳', '🤩', '🤯', '😴', '🧐', '🦄',
  '🦁', '🐯', '🦊', '🐨', '🐼', '🐸', '🐵', '🐔', '🐧', '🐦',
  '🐙', '🦋', '🍎', '🍕', '🎉', '🚀', '⭐', '💡', '❤️', '💯'
];

export function getNextEmoji(currentIndex: number): string {
  return PERSON_EMOJIS[currentIndex % PERSON_EMOJIS.length];
}
