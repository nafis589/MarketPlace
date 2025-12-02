# Système de Nettoyage d'Images (Slazzer + Express)

Ce module permet de supprimer automatiquement l'arrière-plan des images de produits en utilisant l'API Slazzer.

## 📂 Structure

- **backend-image-cleaner/** : Serveur Express qui gère l'API Slazzer.
- **scripts/cleanCloudinaryProducts.ts** : Script pour nettoyer toutes les images du fichier `cloudinaryProducts.ts`.
- **hooks/useCleanImage.ts** : Hook React pour nettoyer une image à la volée depuis le frontend.

---

## 🚀 1. Installation et Lancement du Backend

1.  Allez dans le dossier du backend :
    ```bash
    cd backend-image-cleaner
    ```

2.  Installez les dépendances :
    ```bash
    npm install
    ```

3.  Configurez les variables d'environnement :
    - Renommez le fichier `env_config` (ou `.env.example`) en `.env`.
    - Ouvrez `.env` et ajoutez votre clé API Slazzer :
      ```env
      PORT=3001
      SLAZZER_API_KEY=votre_cle_api_slazzer_ici
      INTERNAL_API_KEY=votre_cle_secrete_interne
      ```

4.  Lancez le serveur :
    ```bash
    npm run dev
    ```
    Le serveur tournera sur `http://localhost:3001`.

---

## 🛠 2. Nettoyer TOUTES les images (Script)

Ce script parcourt `data/cloudinaryProducts.ts`, envoie chaque image au backend pour suppression du fond, et met à jour le fichier avec les images en Base64.

1.  Assurez-vous que le backend tourne (`npm run dev` dans `backend-image-cleaner`).
2.  À la racine du projet Next.js, lancez le script :
    ```bash
    npx ts-node --project scripts/tsconfig.json scripts/cleanCloudinaryProducts.ts
    ```
    *Note : Vous devrez peut-être installer `ts-node` globalement ou dans le projet si ce n'est pas déjà fait (`npm install -D ts-node`).*

3.  Le script affichera la progression :
    - `cleaning... [id]`
    - `success → updated product id [id]`
    - `error → skip product`

4.  Une fois terminé, `data/cloudinaryProducts.ts` sera mis à jour.

---

## 💻 3. Utilisation Frontend (Hook)

Utilisez le hook `useCleanImage` pour nettoyer une image individuellement (par exemple lors de l'ajout d'un produit ou d'une édition).

```typescript
import { useCleanImage } from '@/hooks/useCleanImage';

const MyComponent = ({ product }) => {
  const { cleanImage, loading, error } = useCleanImage();

  const handleClean = async () => {
    const cleanBase64 = await cleanImage(product.image);
    if (cleanBase64) {
      console.log("Image nettoyée :", cleanBase64);
      // Mettre à jour l'état ou envoyer au serveur
    }
  };

  return (
    <div>
      <img src={product.image} alt="Product" />
      <button onClick={handleClean} disabled={loading}>
        {loading ? 'Nettoyage...' : 'Retirer le fond'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

## 🔄 Comment mettre à jour si de nouvelles images sont ajoutées ?

Si vous ajoutez de nouveaux produits dans `cloudinaryProducts.ts` avec des URLs Cloudinary brutes :

1.  Relancez simplement le script :
    ```bash
    npx ts-node --project scripts/tsconfig.json scripts/cleanCloudinaryProducts.ts
    ```
2.  Le script ignorera automatiquement les images qui sont déjà en Base64 (commençant par `data:image`) et ne traitera que les nouvelles URLs.
