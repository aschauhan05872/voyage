/** Standard modern birthstone reference — one primary stone per month for VOYAGE collection. */
export const birthstones = [
  { month: "January", gemstone: "Garnet", slug: "january-birthstone-garnet-necklace", color: "#7B1E3A" },
  { month: "February", gemstone: "Amethyst", slug: "february-birthstone-amethyst-necklace", color: "#6B4C9A" },
  { month: "March", gemstone: "Aquamarine", slug: "march-birthstone-aquamarine-necklace", color: "#7EB6C9" },
  { month: "April", gemstone: "White Topaz", slug: "april-birthstone-white-topaz-necklace", color: "#E8E8E8" },
  { month: "May", gemstone: "Emerald", slug: "may-birthstone-emerald-necklace", color: "#2E6B4F" },
  { month: "June", gemstone: "Moonstone", slug: "june-birthstone-moonstone-necklace", color: "#D4CFC7" },
  { month: "July", gemstone: "Ruby", slug: "july-birthstone-ruby-necklace", color: "#9B1B30" },
  { month: "August", gemstone: "Peridot", slug: "august-birthstone-peridot-necklace", color: "#7A9B3C" },
  { month: "September", gemstone: "Sapphire", slug: "september-birthstone-sapphire-necklace", color: "#1E3A5F" },
  { month: "October", gemstone: "Opal", slug: "october-birthstone-opal-necklace", color: "#C8D8E0" },
  { month: "November", gemstone: "Citrine", slug: "november-birthstone-citrine-necklace", color: "#D4A017" },
  { month: "December", gemstone: "Blue Topaz", slug: "december-birthstone-blue-topaz-necklace", color: "#4A90C2" },
] as const;

export type Birthstone = (typeof birthstones)[number];
