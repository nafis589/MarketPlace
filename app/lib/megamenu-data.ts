
import { NavItem } from "./navigation";

export interface SubLink {
    label: string;
    href: string;
}

export interface CategoryGroup {
    title: string;
    items: SubLink[];
}

// Alias for compatibility with MegaMenu component
export type MegaMenuColumn = CategoryGroup;

export interface MenuCategoryData {
    discover?: SubLink[]; // Items for the "DÉCOUVRIR" column
    categories: CategoryGroup[];
}

export const megaMenuData: Record<string, MenuCategoryData> = {

    /* ----------------------------------------------------------
     * NOUVEAUTÉS
     * ---------------------------------------------------------*/
    nouveautes: {
        discover: [
            { label: "Voir tout", href: "/nouveautes" },
            { label: "We Love", href: "/we-love" },
            { label: "Sacs", href: "/nouveautes/sacs" },
            { label: "Montres", href: "/nouveautes/montres" },
            { label: "Bijoux", href: "/nouveautes/bijoux" },
        ],
        categories: [
            {
                title: "FEMME",
                items: [
                    { label: "Voir tout", href: "/femme/nouveautes" },
                    { label: "Sacs", href: "/femme/sacs" },
                    { label: "Vêtements", href: "/femme/vetements" },
                    { label: "Chaussures", href: "/femme/chaussures" },
                    { label: "Bijoux", href: "/femme/bijoux" },
                    { label: "Montres", href: "/femme/montres" },
                    { label: "Accessoires", href: "/femme/accessoires" },
                ]
            },
            {
                title: "ENFANTS",
                items: [
                    { label: "Voir tout", href: "/enfant/nouveautes" },
                    { label: "Fille", href: "/enfant/fille" },
                    { label: "Garçon", href: "/enfant/garcon" },
                ]
            },
            {
                title: "HOMME",
                items: [
                    { label: "Voir tout", href: "/homme/nouveautes" },
                    { label: "Sacs", href: "/homme/sacs" },
                    { label: "Vêtements", href: "/homme/vetements" },
                    { label: "Chaussures", href: "/homme/chaussures" },
                    { label: "Bijoux", href: "/homme/bijoux" },
                    { label: "Montres", href: "/homme/montres" },
                    { label: "Accessoires", href: "/homme/accessoires" },
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * HOMME
     * ---------------------------------------------------------*/
    homme: {
        discover: [
            { label: "Page d'accueil", href: "/homme" },
            { label: "Mode homme", href: "/homme/mode" },
        ],
        categories: [
            {
                title: "VÊTEMENTS",
                items: [
                    { label: "Nouveautés", href: "/homme/vetements/nouveautes" },
                    { label: "Manteaux", href: "/homme/vetements/manteaux" },
                    { label: "Vestes", href: "/homme/vetements/vestes" },
                    { label: "Mailles et pulls", href: "/homme/vetements/mailles-pulls" },
                    { label: "Chemises", href: "/homme/vetements/chemises" },
                    { label: "Polos", href: "/homme/vetements/polos" },
                    { label: "T-shirts", href: "/homme/vetements/t-shirts" },
                    { label: "Jeans", href: "/homme/vetements/jeans" },
                    { label: "Pantalons", href: "/homme/vetements/pantalons" },
                    { label: "Shorts", href: "/homme/vetements/shorts" },
                    { label: "Costumes", href: "/homme/vetements/costumes" },
                    { label: "Bain", href: "/homme/vetements/bain" },
                    { label: "Tous les vêtements", href: "/homme/vetements" },
                ]
            },
            {
                title: "CHAUSSURES",
                items: [
                    { label: "Nouveautés", href: "/homme/chaussures/nouveautes" },
                    { label: "Baskets", href: "/homme/chaussures/baskets" },
                    { label: "Bottes et bottines", href: "/homme/chaussures/bottes" },
                    { label: "Derbies", href: "/homme/chaussures/derbies" },
                    { label: "Chaussures plates", href: "/homme/chaussures/plates" },
                    { label: "Sandales", href: "/homme/chaussures/sandales" },
                    { label: "Espadrilles", href: "/homme/chaussures/espadrilles" },
                    { label: "Toutes les chaussures", href: "/homme/chaussures" },
                ]
            },
            {
                title: "SACS & ACCESSOIRES",
                items: [
                    { label: "Nouveautés", href: "/homme/accessoires/nouveautes" },
                    { label: "Bags", href: "/homme/accessoires/bags" },
                    { label: "Small bags, wallets & cases", href: "/homme/accessoires/small-bags" },
                    { label: "Sacs ceinture", href: "/homme/accessoires/sacs-ceinture" },
                    { label: "Belts", href: "/homme/accessoires/belts" },
                    { label: "Sunglasses", href: "/homme/accessoires/lunettes" },
                    { label: "Scarves & pocket squares", href: "/homme/accessoires/foulards" },
                    { label: "Ties", href: "/homme/accessoires/cravates" },
                    { label: "Hats & pull on hats", href: "/homme/accessoires/chapeaux" },
                    { label: "Gloves", href: "/homme/accessoires/gants" },
                    { label: "Cufflinks", href: "/homme/accessoires/boutons-de-manchette" },
                    { label: "Tous les sacs", href: "/homme/sacs" },
                ]
            },
            {
                title: "MONTRES & BIJOUX",
                items: [
                    { label: "Nouveautés montres", href: "/homme/montres/nouveautes" },
                    { label: "Nouveautés bijoux", href: "/homme/bijoux/nouveautes" },
                    { label: "Toutes les montres", href: "/homme/montres" },
                    { label: "Tous les bijoux", href: "/homme/bijoux" },
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * FEMME
     * ---------------------------------------------------------*/
    femme: {
        discover: [
            { label: "Page d'accueil", href: "/femme" },
            { label: "Mode femme", href: "/femme/mode" },
        ],
        categories: [
            {
                title: "SACS",
                items: [
                    { label: "Nouveautés", href: "/femme/sacs/nouveautes" },
                    { label: "Sacs à main", href: "/femme/sacs/main" },
                    { label: "Sacs porté épaule", href: "/femme/sacs/epaule" },
                    { label: "Cabas", href: "/femme/sacs/cabas" },
                    { label: "Sacs à bandoulière", href: "/femme/sacs/bandouliere" },
                    { label: "Pochettes", href: "/femme/sacs/pochettes" },
                    { label: "Sacs ceinture", href: "/femme/sacs/ceinture" },
                    { label: "Sacs à dos", href: "/femme/sacs/dos" },
                    { label: "Sacs de voyage", href: "/femme/sacs/voyage" },
                    { label: "Sacoches", href: "/femme/sacs/sacoches" },
                    { label: "Tous les sacs", href: "/femme/sacs" },
                ]
            },
            {
                title: "MONTRES & BIJOUX",
                items: [
                    { label: "Nouveautés montres", href: "/femme/montres/nouveautes" },
                    { label: "Nouveautés bijoux", href: "/femme/bijoux/nouveautes" },
                    { label: "Bagues", href: "/femme/bijoux/bagues" },
                    { label: "Bracelets", href: "/femme/bijoux/bracelets" },
                    { label: "Colliers", href: "/femme/bijoux/colliers" },
                    { label: "Boucles d’oreilles", href: "/femme/bijoux/boucles" },
                    { label: "Toutes les montres", href: "/femme/montres" },
                    { label: "Tous les bijoux", href: "/femme/bijoux" },
                ]
            },
            {
                title: "VÊTEMENTS",
                items: [
                    { label: "Nouveautés", href: "/femme/vetements/nouveautes" },
                    { label: "Manteaux", href: "/femme/vetements/manteaux" },
                    { label: "Trench-coats", href: "/femme/vetements/trench" },
                    { label: "Vestes", href: "/femme/vetements/vestes" },
                    { label: "Vestes en cuir", href: "/femme/vetements/cuir" },
                    { label: "Robes", href: "/femme/vetements/robes" },
                    { label: "Mailles", href: "/femme/vetements/mailles" },
                    { label: "Hauts", href: "/femme/vetements/hauts" },
                    { label: "Jupes", href: "/femme/vetements/jupes" },
                    { label: "Shorts", href: "/femme/vetements/shorts" },
                    { label: "Pantalons", href: "/femme/vetements/pantalons" },
                    { label: "Jeans", href: "/femme/vetements/jeans" },
                    { label: "Combinaisons", href: "/femme/vetements/combinaisons" },
                    { label: "Lingerie", href: "/femme/vetements/lingerie" },
                    { label: "Maillots de bain", href: "/femme/vetements/bain" },
                    { label: "Tous les vêtements", href: "/femme/vetements" },
                ]
            },
            {
                title: "CHAUSSURES",
                items: [
                    { label: "Nouveautés", href: "/femme/chaussures/nouveautes" },
                    { label: "Chaussures à talons", href: "/femme/chaussures/talons" },
                    { label: "Bottines", href: "/femme/chaussures/bottines" },
                    { label: "Bottes et bottines", href: "/femme/chaussures/bottes" },
                    { label: "Sandales", href: "/femme/chaussures/sandales" },
                    { label: "Espadrilles", href: "/femme/chaussures/espadrilles" },
                    { label: "Mules et sabots", href: "/femme/chaussures/mules" },
                    { label: "Baskets", href: "/femme/chaussures/baskets" },
                    { label: "Mocassins", href: "/femme/chaussures/mocassins" },
                    { label: "Ballerines", href: "/femme/chaussures/ballerines" },
                    { label: "Derbies et richelieus", href: "/femme/chaussures/derbies" },
                    { label: "Toutes les chaussures", href: "/femme/chaussures" },
                ]
            },
            {
                title: "ACCESSOIRES",
                items: [
                    { label: "Nouveautés", href: "/femme/accessoires/nouveautes" },
                    { label: "Scarves", href: "/femme/accessoires/scarves" },
                    { label: "Silk handkerchief", href: "/femme/accessoires/silk" },
                    { label: "Gloves", href: "/femme/accessoires/gloves" },
                    { label: "Chapeaux", href: "/femme/accessoires/chapeaux" },
                    { label: "Wallets", href: "/femme/accessoires/wallets" },
                    { label: "Belts", href: "/femme/accessoires/belts" },
                    { label: "Sunglasses", href: "/femme/accessoires/sunglasses" },
                    { label: "Purses, wallets & cases", href: "/femme/accessoires/purses" },
                    { label: "Tous les accessoires", href: "/femme/accessoires" },
                ]
            },
        ]
    },

    /* ----------------------------------------------------------
     * DESIGNERS
     * ---------------------------------------------------------*/
    designers: {
        categories: [
            {
                title: "NOTRE SÉLECTION",
                items: [
                    { label: "Balenciaga", href: "/designers/balenciaga" },
                    { label: "Balmain", href: "/designers/balmain" },
                    { label: "Bottega Veneta", href: "/designers/bottega" },
                    { label: "Burberry", href: "/designers/burberry" },
                    { label: "Celine", href: "/designers/celine" },
                    { label: "Chanel", href: "/designers/chanel" },
                    { label: "Chloé", href: "/designers/chloe" },
                    { label: "Christian Louboutin", href: "/designers/louboutin" },
                    { label: "Coach", href: "/designers/coach" },
                    { label: "Dior", href: "/designers/dior" },
                    { label: "Dolce & Gabbana", href: "/designers/dg" },
                    { label: "Fendi", href: "/designers/fendi" },
                    { label: "Givenchy", href: "/designers/givenchy" },
                    { label: "Golden Goose", href: "/designers/golden-goose" },
                ]
            },
            {
                title: "TOUS LES DESIGNERS",
                items: [
                    { label: "Gucci", href: "/designers/gucci" },
                    { label: "Hermès", href: "/designers/hermes" },
                    { label: "Isabel Marant", href: "/designers/isabel-marant" },
                    { label: "Jean Paul Gaultier", href: "/designers/jpg" },
                    { label: "Moncler", href: "/designers/moncler" },
                    { label: "Off-White", href: "/designers/off-white" },
                    { label: "Prada", href: "/designers/prada" },
                    { label: "Saint Laurent", href: "/designers/saint-laurent" },
                    { label: "Salvatore Ferragamo", href: "/designers/ferragamo" },
                    { label: "Tory Burch", href: "/designers/tory-burch" },
                    { label: "Valentino Garavani", href: "/designers/valentino" },
                    { label: "Versace", href: "/designers/versace" },
                    { label: "Yves Saint Laurent", href: "/designers/ysl" },
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * SACS
     * ---------------------------------------------------------*/
    sacs: {
        categories: [
            {
                title: "DESIGNERS",
                items: [
                    { label: "Balenciaga", href: "/sacs/designers/balenciaga" },
                    { label: "Bottega Veneta", href: "/sacs/designers/bottega" },
                    { label: "Burberry", href: "/sacs/designers/burberry" },
                    { label: "Céline", href: "/sacs/designers/celine" },
                    { label: "Chanel", href: "/sacs/designers/chanel" },
                    { label: "Coach", href: "/sacs/designers/coach" },
                    { label: "Dior", href: "/sacs/designers/dior" },
                    { label: "Fendi", href: "/sacs/designers/fendi" },
                    { label: "Gucci", href: "/sacs/designers/gucci" },
                    { label: "Hermès", href: "/sacs/designers/hermes" },
                    { label: "Loewe", href: "/sacs/designers/loewe" },
                    { label: "Louis Vuitton", href: "/sacs/designers/lv" },
                    { label: "Mulberry", href: "/sacs/designers/mulberry" },
                    { label: "Prada", href: "/sacs/designers/prada" },
                    { label: "Saint Laurent", href: "/sacs/designers/saint-laurent" },
                ]
            },
            {
                title: "MODÈLES ICONIQUES",
                items: [
                    { label: "Birkin 25", href: "/sacs/iconiques/birkin-25" },
                    { label: "Birkin 30", href: "/sacs/iconiques/birkin-30" },
                    { label: "Birkin 40", href: "/sacs/iconiques/birkin-40" },
                    { label: "Constance", href: "/sacs/iconiques/constance" },
                    { label: "Dionysus", href: "/sacs/iconiques/dionysus" },
                    { label: "Jackie Vintage", href: "/sacs/iconiques/jackie" },
                    { label: "Marmont", href: "/sacs/iconiques/marmont" },
                    { label: "Neverfull", href: "/sacs/iconiques/neverfull" },
                    { label: "Pochette Accessoire", href: "/sacs/iconiques/pochette" },
                    { label: "Saddle", href: "/sacs/iconiques/saddle" },
                    { label: "Speedy", href: "/sacs/iconiques/speedy" },
                    { label: "Timeless/Classique", href: "/sacs/iconiques/timeless" },
                    { label: "Veneta", href: "/sacs/iconiques/veneta" },
                    { label: "Wallet on Chain", href: "/sacs/iconiques/woc" },
                ]
            },
            {
                title: "FEMME",
                items: [
                    { label: "Tous les sacs", href: "/sacs/femme" },
                    { label: "Sacs à main", href: "/sacs/femme/main" },
                    { label: "Sacs porté épaule", href: "/sacs/femme/epaule" },
                    { label: "Cabas", href: "/sacs/femme/cabas" },
                    { label: "Sacs à bandoulière", href: "/sacs/femme/bandouliere" },
                    { label: "Pochettes", href: "/sacs/femme/pochettes" },
                    { label: "Sacs à dos", href: "/sacs/femme/dos" },
                    { label: "Sacs de voyage", href: "/sacs/femme/voyage" },
                    { label: "Sacoches", href: "/sacs/femme/sacoches" },
                ]
            },
            {
                title: "HOMME",
                items: [
                    { label: "Tous les sacs", href: "/sacs/homme" },
                    { label: "Sacs", href: "/sacs/homme/general" },
                    { label: "Petite maroquinerie", href: "/sacs/homme/maroquinerie" },
                    { label: "Sacs ceinture", href: "/sacs/homme/ceinture" }
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * BIJOUX & MONTRES
     * ---------------------------------------------------------*/
    "bijoux-montres": {
        categories: [
            {
                title: "MONTRES ICONIQUES",
                items: [
                    { label: "Breitling", href: "/montres/breitling" },
                    { label: "Burberry", href: "/montres/burberry" },
                    { label: "Cartier", href: "/montres/cartier" },
                    { label: "Chanel", href: "/montres/chanel" },
                    { label: "Gucci", href: "/montres/gucci" },
                    { label: "Hermès", href: "/montres/hermes" },
                    { label: "Hublot", href: "/montres/hublot" },
                    { label: "Longines", href: "/montres/longines" },
                    { label: "Louis Vuitton", href: "/montres/lv" },
                    { label: "Michael Kors", href: "/montres/michael-kors" },
                    { label: "Omega", href: "/montres/omega" },
                    { label: "Rolex", href: "/montres/rolex" },
                    { label: "Tag Heuer", href: "/montres/tag-heuer" },
                    { label: "Yves Saint Laurent", href: "/montres/ysl" },
                ]
            },
            {
                title: "BIJOUX ICONIQUES",
                items: [
                    { label: "Cartier", href: "/bijoux/cartier" },
                    { label: "Céline", href: "/bijoux/celine" },
                    { label: "Chanel", href: "/bijoux/chanel" },
                    { label: "Christian Dior", href: "/bijoux/dior" },
                    { label: "Dior", href: "/bijoux/dior" },
                    { label: "Fendi", href: "/bijoux/fendi" },
                    { label: "Givenchy", href: "/bijoux/givenchy" },
                    { label: "Gucci", href: "/bijoux/gucci" },
                    { label: "Hermès", href: "/bijoux/hermes" },
                    { label: "Kate Spade", href: "/bijoux/kate-spade" },
                    { label: "Louis Vuitton", href: "/bijoux/lv" },
                    { label: "Tiffany & Co", href: "/bijoux/tiffany" },
                    { label: "Van Cleef & Arpels", href: "/bijoux/van-cleef" },
                    { label: "Yves Saint Laurent", href: "/bijoux/ysl" },
                ]
            },
            {
                title: "FEMME",
                items: [
                    { label: "Nouveautés montres", href: "/femme/montres/nouveautes" },
                    { label: "Nouveautés bijoux", href: "/femme/bijoux/nouveautes" },
                    { label: "Bagues", href: "/bijoux/femme/bagues" },
                    { label: "Bracelets", href: "/bijoux/femme/bracelets" },
                    { label: "Colliers", href: "/bijoux/femme/colliers" },
                    { label: "Boucles d’oreilles", href: "/bijoux/femme/boucles" },
                    { label: "Toutes les montres", href: "/montres/femme" },
                    { label: "Tous les bijoux", href: "/bijoux/femme" }
                ]
            },
            {
                title: "HOMME",
                items: [
                    { label: "Nouveautés montres", href: "/homme/montres/nouveautes" },
                    { label: "Nouveautés bijoux", href: "/homme/bijoux/nouveautes" },
                    { label: "Toutes les montres", href: "/montres/homme" },
                    { label: "Tous les bijoux", href: "/bijoux/homme" }
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * VINTAGE
     * ---------------------------------------------------------*/
    vintage: {
        categories: [
            {
                title: "DESIGNERS",
                items: [
                    { label: "Burberry", href: "/vintage/burberry" },
                    { label: "Cartier", href: "/vintage/cartier" },
                    { label: "Céline", href: "/vintage/celine" },
                    { label: "Chanel", href: "/vintage/chanel" },
                    { label: "Dior", href: "/vintage/dior" },
                    { label: "Fendi", href: "/vintage/fendi" },
                    { label: "Gianni Versace", href: "/vintage/versace" },
                    { label: "Gucci", href: "/vintage/gucci" },
                    { label: "Hermès", href: "/vintage/hermes" },
                    { label: "Jean Paul Gaultier", href: "/vintage/jpg" },
                    { label: "Louis Vuitton", href: "/vintage/lv" },
                    { label: "Maison Martin Margiela", href: "/vintage/margiela" },
                    { label: "Prada", href: "/vintage/prada" },
                    { label: "Yves Saint Laurent", href: "/vintage/ysl" },
                ]
            },
            {
                title: "FEMME",
                items: [
                    { label: "Voir tout", href: "/vintage/femme" },
                    { label: "Sacs", href: "/vintage/femme/sacs" },
                    { label: "Vêtements", href: "/vintage/femme/vetements" },
                    { label: "Chaussures", href: "/vintage/femme/chaussures" },
                    { label: "Bijoux", href: "/vintage/femme/bijoux" },
                    { label: "Montres", href: "/vintage/femme/montres" },
                    { label: "Accessoires", href: "/vintage/femme/accessoires" },
                ]
            },
            {
                title: "KIDS",
                items: [
                    { label: "Voir tout", href: "/vintage/kids" },
                    { label: "Fille", href: "/vintage/kids/fille" },
                    { label: "Garçon", href: "/vintage/kids/garcon" },
                ]
            },
            {
                title: "HOMME",
                items: [
                    { label: "Voir tout", href: "/vintage/homme" },
                    { label: "Sacs", href: "/vintage/homme/sacs" },
                    { label: "Vêtements", href: "/vintage/homme/vetements" },
                    { label: "Chaussures", href: "/vintage/homme/chaussures" },
                    { label: "Bijoux", href: "/vintage/homme/bijoux" },
                    { label: "Montres", href: "/vintage/homme/montres" },
                    { label: "Accessoires", href: "/vintage/homme/accessoires" },
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * WE LOVE
     * ---------------------------------------------------------*/
    "we-love": {
        categories: [
            {
                title: "DESIGNERS",
                items: [
                    { label: "Balenciaga", href: "/we-love/balenciaga" },
                    { label: "Cartier", href: "/we-love/cartier" },
                    { label: "Céline", href: "/we-love/celine" },
                    { label: "Chanel", href: "/we-love/chanel" },
                    { label: "Dior", href: "/we-love/dior" },
                    { label: "Fendi", href: "/we-love/fendi" },
                    { label: "Ganni", href: "/we-love/ganni" },
                    { label: "Gucci", href: "/we-love/gucci" },
                    { label: "Hermès", href: "/we-love/hermes" },
                    { label: "Jacquemus", href: "/we-love/jacquemus" },
                    { label: "Loewe", href: "/we-love/loewe" },
                    { label: "Louis Vuitton", href: "/we-love/lv" },
                    { label: "Prada", href: "/we-love/prada" },
                    { label: "Saint Laurent", href: "/we-love/saint-laurent" },
                ]
            },
            {
                title: "FEMME",
                items: [
                    { label: "Voir tout", href: "/we-love/femme" },
                    { label: "Sacs", href: "/we-love/femme/sacs" },
                    { label: "Vêtements", href: "/we-love/femme/vetements" },
                    { label: "Chaussures", href: "/we-love/femme/chaussures" },
                    { label: "Bijoux", href: "/we-love/femme/bijoux" },
                    { label: "Montres", href: "/we-love/femme/montres" },
                    { label: "Accessoires", href: "/we-love/femme/accessoires" },
                ]
            },
            {
                title: "ENFANT",
                items: [
                    { label: "Voir tout", href: "/we-love/enfant" },
                    { label: "Fille", href: "/we-love/enfant/fille" },
                    { label: "Garçon", href: "/we-love/enfant/garcon" },
                ]
            },
            {
                title: "HOMME",
                items: [
                    { label: "Voir tout", href: "/we-love/homme" },
                    { label: "Sacs", href: "/we-love/homme/sacs" },
                    { label: "Vêtements", href: "/we-love/homme/vetements" },
                    { label: "Chaussures", href: "/we-love/homme/chaussures" },
                    { label: "Bijoux", href: "/we-love/homme/bijoux" },
                    { label: "Montres", href: "/we-love/homme/montres" },
                    { label: "Accessoires", href: "/we-love/homme/accessoires" },
                ]
            }
        ]
    },

    /* ----------------------------------------------------------
     * ENFANT
     * ---------------------------------------------------------*/
    enfant: {
        categories: [
            {
                title: "ENFANT",
                items: [
                    { label: "Voir tout", href: "/enfant" },
                    { label: "Fille", href: "/enfant/fille" },
                    { label: "Garçon", href: "/enfant/garcon" },
                    { label: "Bébé", href: "/enfant/bebe" },
                    { label: "Chaussures", href: "/enfant/chaussures" },
                    { label: "Vêtements", href: "/enfant/vetements" },
                ]
            }
        ]
    }
};
