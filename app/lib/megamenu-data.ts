import { NavItem } from './navigation';

export interface SubLink {
    label: string;
    href: string;
}

export interface CategoryGroup {
    title: string;
    items: SubLink[];
}

export interface MenuCategoryData {
    discover: SubLink[];
    categories: CategoryGroup[];
}

export const megaMenuData: Record<string, MenuCategoryData> = {
    homme: {
        discover: [
            { label: "Mode homme", href: "/homme" },
            { label: "Nouveautés", href: "/homme/nouveautes" },
            { label: "Créateurs", href: "/homme/createurs" },
            { label: "Bestsellers", href: "/homme/bestsellers" },
        ],
        categories: [
            {
                title: "VÊTEMENTS",
                items: [
                    { label: "Manteaux", href: "/homme/vetements/manteaux" },
                    { label: "Vestes", href: "/homme/vetements/vestes" },
                    { label: "Mailles et pulls", href: "/homme/vetements/mailles-pulls" },
                    { label: "Chemises", href: "/homme/vetements/chemises" },
                    { label: "Pantalons", href: "/homme/vetements/pantalons" },
                    { label: "Jeans", href: "/homme/vetements/jeans" },
                    { label: "T-shirts", href: "/homme/vetements/t-shirts" },
                    { label: "Costumes", href: "/homme/vetements/costumes" },
                ],
            },
            {
                title: "CHAUSSURES",
                items: [
                    { label: "Baskets", href: "/homme/chaussures/baskets" },
                    { label: "Bottes", href: "/homme/chaussures/bottes" },
                    { label: "Mocassins", href: "/homme/chaussures/mocassins" },
                    { label: "Sandales", href: "/homme/chaussures/sandales" },
                ],
            },
            {
                title: "SACS",
                items: [
                    { label: "Sacs à dos", href: "/homme/sacs/sacs-a-dos" },
                    { label: "Sacs de voyage", href: "/homme/sacs/voyage" },
                    { label: "Porte-documents", href: "/homme/sacs/porte-documents" },
                    { label: "Bananes", href: "/homme/sacs/bananes" },
                ],
            },
            {
                title: "ACCESSOIRES",
                items: [
                    { label: "Montres", href: "/homme/accessoires/montres" },
                    { label: "Ceintures", href: "/homme/accessoires/ceintures" },
                    { label: "Lunettes", href: "/homme/accessoires/lunettes" },
                    { label: "Chapeaux", href: "/homme/accessoires/chapeaux" },
                ],
            },
        ],
    },
    femme: {
        discover: [
            { label: "Mode femme", href: "/femme" },
            { label: "Nouveautés", href: "/femme/nouveautes" },
            { label: "Marques de luxe", href: "/femme/marques" },
            { label: "Sacs iconiques", href: "/femme/sacs-iconiques" },
        ],
        categories: [
            {
                title: "VÊTEMENTS",
                items: [
                    { label: "Robes", href: "/femme/vetements/robes" },
                    { label: "Tops", href: "/femme/vetements/tops" },
                    { label: "Manteaux", href: "/femme/vetements/manteaux" },
                    { label: "Pantalons", href: "/femme/vetements/pantalons" },
                    { label: "Jupes", href: "/femme/vetements/jupes" },
                    { label: "Mailles", href: "/femme/vetements/mailles" },
                ],
            },
            {
                title: "SACS",
                items: [
                    { label: "Sacs à main", href: "/femme/sacs/main" },
                    { label: "Sacs bandoulière", href: "/femme/sacs/bandouliere" },
                    { label: "Pochettes", href: "/femme/sacs/pochettes" },
                    { label: "Sacs à dos", href: "/femme/sacs/dos" },
                ],
            },
            {
                title: "CHAUSSURES",
                items: [
                    { label: "Talons", href: "/femme/chaussures/talons" },
                    { label: "Baskets", href: "/femme/chaussures/baskets" },
                    { label: "Bottes", href: "/femme/chaussures/bottes" },
                    { label: "Sandales", href: "/femme/chaussures/sandales" },
                ],
            },
            {
                title: "BIJOUX & MONTRES",
                items: [
                    { label: "Bagues", href: "/femme/bijoux/bagues" },
                    { label: "Boucles d'oreilles", href: "/femme/bijoux/boucles" },
                    { label: "Colliers", href: "/femme/bijoux/colliers" },
                    { label: "Montres", href: "/femme/bijoux/montres" },
                ],
            },
        ],
    },
    default: {
        discover: [
            { label: "Nouveautés", href: "/nouveautes" },
            { label: "Sélection", href: "/selection" },
        ],
        categories: [
            {
                title: "CATÉGORIES",
                items: [
                    { label: "Vêtements", href: "/vetements" },
                    { label: "Chaussures", href: "/chaussures" },
                    { label: "Sacs", href: "/sacs" },
                    { label: "Accessoires", href: "/accessoires" },
                ],
            },
        ],
    },
};
