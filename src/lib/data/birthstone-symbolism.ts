/** Traditional symbolism — cultural associations, not health claims. */
export const birthstoneSymbolism: Record<string, string> = {
  january: "Traditionally associated with protection and steadfast affection.",
  february: "Traditionally associated with calm, clarity and balance.",
  march: "Often symbolized as a stone of serenity and clarity.",
  april: "Traditionally associated with purity and radiant beginnings.",
  may: "Often symbolized as a stone of renewal and growth.",
  june: "Traditionally associated with intuition and new beginnings.",
  july: "Often symbolized as a stone of passion and vitality.",
  august: "Traditionally associated with warmth and positive energy.",
  september: "Often symbolized as a stone of wisdom and loyalty.",
  october: "Traditionally associated with creativity and hope.",
  november: "Often symbolized as a stone of joy and abundance.",
  december: "Traditionally associated with clarity and peaceful reflection.",
};

export function getBirthstoneSymbolism(monthSlug: string): string | undefined {
  return birthstoneSymbolism[monthSlug];
}
