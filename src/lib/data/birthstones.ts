/** Standard modern birthstone reference — one primary stone per month for VOYAGE collection. */
export const birthstones = [
  {
    month: "January",
    monthSlug: "january",
    gemstone: "Garnet",
    productSlug: "january-birthstone-garnet-necklace",
    color: "#7B1E3A",
    image: "/placeholders/birthstones/january-garnet.svg",
  },
  {
    month: "February",
    monthSlug: "february",
    gemstone: "Amethyst",
    productSlug: "february-birthstone-amethyst-necklace",
    color: "#6B4C9A",
    image: "/placeholders/birthstones/february-amethyst.svg",
  },
  {
    month: "March",
    monthSlug: "march",
    gemstone: "Aquamarine",
    productSlug: "march-birthstone-aquamarine-necklace",
    color: "#7EB6C9",
    image: "/placeholders/birthstones/march-aquamarine.svg",
  },
  {
    month: "April",
    monthSlug: "april",
    gemstone: "White Topaz",
    productSlug: "april-birthstone-white-topaz-necklace",
    color: "#E8E8E8",
    image: "/placeholders/birthstones/april-topaz.svg",
  },
  {
    month: "May",
    monthSlug: "may",
    gemstone: "Emerald",
    productSlug: "may-birthstone-emerald-necklace",
    color: "#2E6B4F",
    image: "/placeholders/birthstones/may-emerald.svg",
  },
  {
    month: "June",
    monthSlug: "june",
    gemstone: "Moonstone",
    productSlug: "june-birthstone-moonstone-necklace",
    color: "#D4CFC7",
    image: "/placeholders/birthstones/june-moonstone.svg",
  },
  {
    month: "July",
    monthSlug: "july",
    gemstone: "Ruby",
    productSlug: "july-birthstone-ruby-necklace",
    color: "#9B1B30",
    image: "/placeholders/birthstones/july-ruby.svg",
  },
  {
    month: "August",
    monthSlug: "august",
    gemstone: "Peridot",
    productSlug: "august-birthstone-peridot-necklace",
    color: "#7A9B3C",
    image: "/placeholders/birthstones/august-peridot.svg",
  },
  {
    month: "September",
    monthSlug: "september",
    gemstone: "Sapphire",
    productSlug: "september-birthstone-sapphire-necklace",
    color: "#1E3A5F",
    image: "/placeholders/birthstones/september-sapphire.svg",
  },
  {
    month: "October",
    monthSlug: "october",
    gemstone: "Opal",
    productSlug: "october-birthstone-opal-necklace",
    color: "#C8D8E0",
    image: "/placeholders/birthstones/october-opal.svg",
  },
  {
    month: "November",
    monthSlug: "november",
    gemstone: "Citrine",
    productSlug: "november-birthstone-citrine-necklace",
    color: "#D4A017",
    image: "/placeholders/birthstones/november-citrine.svg",
  },
  {
    month: "December",
    monthSlug: "december",
    gemstone: "Blue Topaz",
    productSlug: "december-birthstone-blue-topaz-necklace",
    color: "#4A90C2",
    image: "/placeholders/birthstones/december-topaz.svg",
  },
] as const;

export type Birthstone = (typeof birthstones)[number];

export function getBirthstoneByMonthSlug(monthSlug: string): Birthstone | undefined {
  return birthstones.find((stone) => stone.monthSlug === monthSlug);
}

export function getBirthstoneProductPath(stone: Birthstone): string {
  return `/products/${stone.productSlug}`;
}
