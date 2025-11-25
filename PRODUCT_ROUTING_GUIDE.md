# Dynamic Product Routing - Documentation & Testing Guide

## 📋 Résumé du système

Le système de routing dynamique permet de naviguer vers des pages détail produit via `/product/[slug]`. Chaque clic sur une carte produit (`ProductCard`) redirige automatiquement vers la page de détail correspondante.

## 🗂️ Architecture des fichiers

### Nouveaux fichiers créés

```
app/
├── types/
│   └── product.ts                    # Types TypeScript pour Product, Seller, etc.
├── utils/
│   └── slug.ts                       # Utilitaires de génération de slugs
├── lib/
│   └── products.ts                   # Base de données mock + helpers
├── components/
│   └── product/
│       ├── ProductDetailComponent.tsx # Composant page détail produit
│       └── RelatedProducts.tsx        # Section produits similaires
└── product/
    └── [slug]/
        ├── page.tsx                  # Route dynamique (server component)
        ├── loading.tsx               # État de chargement (skeleton)
        └── not-found.tsx             # Page 404

```

### Fichiers modifiés

```
app/
├── lib/
│   └── data.ts                       # Ajout des slugs à tous les produits
└── components/
    └── sections/
        ├── BestsellersSection.tsx    # Ajout Link wrapping
        ├── RecentlyViewed.tsx        # Ajout Link wrapping
        ├── TopDeals.tsx              # Ajout Link wrapping
        ├── TrendingNow.tsx           # Ajout Link wrapping
        ├── WeLoveSection.tsx         # Ajout Link wrapping
        └── UserNewItems.tsx          # Ajout Link wrapping
```

## 🔑 Fonctionnalités clés

### 1. **Génération automatique de slugs**
- Chaque produit possède un slug unique (ex: `sac-marmont-gucci-2`)
- Nettoyage automatique des accents et caractères spéciaux
- Format: `{titre-nettoyé}-{id}`

### 2. **SEO dynamique**
- Meta title: `{brand} - {title} | FriperieLuxe`
- Meta description: premiers 160 caractères de la description
- Open Graph et Twitter Cards avec image produit

### 3. **Routing optimisé**
- Static Site Generation (SSG) pour tous les produits
- Pré-génération des routes via `generateStaticParams`
- 404 automatique pour slugs invalides

### 4. **UX améliorée**
- Skeleton loaders pendant le chargement
- Produits similaires en bas de page
- Header/Footer persistants
- Navigation fluide avec Next.js Link

## 🧪 Tests manuels

### Test 1: Navigation depuis la page d'accueil
1. Démarrer le serveur: `npm run dev`
2. Aller sur `http://localhost:3000`
3. Faire défiler jusqu'à la section "Nos Best-sellers"
4. Cliquer sur n'importe quelle carte produit
5. ✅ **Résultat attendu**: Redirection vers `/product/[slug]` avec affichage de la page détail

### Test 2: Produits similaires
1. Sur une page produit (ex: `/product/sac-marmont-gucci-2`)
2. Faire défiler jusqu'à la section "Produits similaires"
3. Cliquer sur un produit similaire
4. ✅ **Résultat attendu**: Navigation vers le nouveau produit avec mise à jour de la page

### Test 3: URL directe
1. Accéder directement à `/product/baskets-polo-ralph-lauren-en-cuir-1`
2. ✅ **Résultat attendu**: Page produit s'affiche correctement
3. Tester avec un slug invalide: `/product/produit-inexistant`
4. ✅ **Résultat attendu**: Page 404 personnalisée

### Test 4: SEO et metadata
1. Sur une page produit, faire clic droit > "Afficher le code source"
2. Vérifier la présence de:
   - `<title>Polo Ralph Lauren - Baskets en cuir Polo Ralph Lauren | FriperieLuxe</title>`
   - `<meta name="description" content="...première partie description...">`
   - `<meta property="og:image" content="...">`
3. ✅ **Résultat attendu**: Toutes les balises SEO sont présentes

### Test 5: Vérification responsive
1. Tester sur mobile (DevTools responsive mode)
2. Vérifier:
   - Galerie d'images fonctionnelle
   - Vignettes verticales deviennent horizontales
   - Boutons CTA accessibles
3. ✅ **Résultat attendu**: Design responsive sans scrolling horizontal

## 📊 Liste des produits disponibles

### Base de données mock (12 produits)

| ID | Slug | Marque | Catégorie |
|----|------|--------|-----------|
| 1 | `baskets-polo-ralph-lauren-en-cuir-1` | Polo Ralph Lauren | Chaussures |
| 2 | `sac-marmont-gucci-2` | Gucci | Sacs |
| 3 | `mocassins-prada-3` | Prada | Chaussures |
| 4 | `speedy-30-louis-vuitton-4` | Louis Vuitton | Sacs |
| 5 | `veste-tweed-chanel-5` | Chanel | Vêtements |
| 6 | `saddle-bag-dior-6` | Dior | Sacs |
| 7 | `carre-soie-hermes-7` | Hermès | Accessoires |
| 8 | `baguette-fendi-8` | Fendi | Sacs |
| 9 | `triple-s-balenciaga-9` | Balenciaga | Chaussures |
| 10 | `sac-loulou-saint-laurent-10` | Saint Laurent | Sacs |
| 11 | `trench-coat-burberry-11` | Burberry | Vêtements |
| 12 | `lunettes-soleil-celine-12` | Celine | Accessoires |

## 🔧 Configuration technique

### Types TypeScript

```typescript
interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  condition: string;
  description: string;
  category: string;
  categories: string[];
  size?: string;
  color?: string;
  material?: string;
  images: string[];
  seller?: Seller;
  likes?: number;
  isBlackFriday?: boolean;
}
```

### Helpers disponibles

```typescript
// Récupérer un produit par slug
const product = getProductBySlug('sac-marmont-gucci-2');

// Récupérer produits similaires
const related = getRelatedProducts('sacs', 'exclude-id', 4);

// Générer un slug
const slug = createSlug('Sac Marmont Gucci', '2'); // -> "sac-marmont-gucci-2"

// Extraire l'ID d'un slug
const id = getIdFromSlug('sac-marmont-gucci-2'); // -> "2"
```

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Vérification après build
1. Vérifier que tous les slugs sont générés dans `.next/server/app/product/`
2. Tester en mode production: `npm start`
3. Valider que les routes statiques fonctionnent sans serveur

## 📝 Ajout de nouveaux produits

### Étapes
1. Ouvrir `app/lib/products.ts`
2. Ajouter un nouvel objet dans le tableau `products`
3. S'assurer d'inclure:
   - `id` unique
   - `slug` généré avec `createSlug(title, id)`
   - Toutes les propriétés requises
   - Au moins 1 image

Exemple:
```typescript
{
  id: '13',
  slug: createSlug('Nouveau Sac Hermès', '13'),
  title: 'Nouveau Sac',
  brand: 'Hermès',
  price: 3500,
  currency: '€',
  condition: 'Comme neuf',
  description: '...',
  category: 'sacs',
  categories: ['Femme', 'Sacs', 'Sacs à main'],
  images: ['...'],
  seller: sellers[0],
}
```

## ⚠️ Points d'attention

### Next.js 15 et params asynchrones
- Les `params` sont maintenant asynchrones
- Toujours utiliser `await params` dans les pages dynamiques

### Images externes
- Configurer `next.config.ts` pour autoriser les domaines d'images
- Vestiaire Collective, Unsplash déjà configurés

### Performance
- Utiliser `priority` sur l'image principale
- Lazy loading automatique pour les produits similaires

## 🐛 Troubleshooting

### Problème: Produit non trouvé (404)
- Vérifier que le slug existe dans `products.ts`
- Vérifier l'orthographe du slug dans l'URL
- Rebuild avec `npm run dev` pour rafraîchir

### Problème: Images ne se chargent pas
- Vérifier `next.config.ts` pour les domaines autorisés
- S'assurer que les URLs d'images sont valides

### Problème: Link ne fonctionne pas
- Vérifier que le produit possède un champ `slug`
- S'assurer que `Link` est importé de `next/link`

## ✅ Checklist finale

- [x] Types TypeScript définis
- [x] Slugs générés pour tous les produits
- [x] Route dynamique `/product/[slug]/page.tsx` créée
- [x] ProductCard wrapped avec Link dans toutes les sections
- [x] Loading et 404 pages créées
- [x] SEO metadata configuré
- [x] Produits similaires affichés
- [x] Header/Footer persistants
- [x] Responsive design validé

## 📞 Support

Pour toute question ou problème, vérifiez:
1. La console du navigateur pour les erreurs
2. Le terminal de développement pour les erreurs serveur
3. Les types TypeScript pour les incompatibilités

---

**Date de création**: 2025-11-25  
**Version Next.js**: 14 (App Router)  
**Auteur**: Antigravity AI
