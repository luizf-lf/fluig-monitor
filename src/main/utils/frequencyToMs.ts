export default function frequencyToMs(dbFrequency: string): number {
  const modifierIndex = dbFrequency.search(/[\D]/);

  const modifier = dbFrequency.charAt(modifierIndex);

  const frequency = Number(dbFrequency.substring(0, modifierIndex));

  if (modifier === 'm') {
    return frequency * 60 * 1000;
  }
  if (modifier === 'h') {
    return frequency * 60 * 60 * 1000;
  }

  return 0;
}
