export interface NavItem {
    label: string;
    href: string;
    key: string; // Unique key to map to MegaMenu data
    isSale?: boolean;
}

export const navItems: NavItem[] = [
    { label: "Nouveautés", href: "/nouveautes", key: "nouveautes" },
    { label: "Designers", href: "/designers", key: "designers" },
    { label: "Femme", href: "/femme", key: "femme" },
    { label: "Homme", href: "/homme", key: "homme" },
    { label: "Enfant", href: "/enfant", key: "enfant" },
    { label: "Sacs", href: "/sacs", key: "sacs" },
    { label: "Bijoux & montres", href: "/bijoux-montres", key: "bijoux-montres" },
    { label: "Vintage", href: "/vintage", key: "vintage" },
    { label: "We Love", href: "/we-love", key: "we-love" },
    { label: "Sale", href: "/sale", key: "sale", isSale: true },
    { label: "À propos de nous", href: "/a-propos", key: "about" },
];
