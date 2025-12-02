import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { cloudinaryProducts } from '../data/cloudinaryProducts';

// Configuration
const API_URL = 'http://localhost:3001/api/images/remove-bg-url';
// Note: In a real scenario, use process.env or a config file. 
// For this script, ensure this matches your backend .env
const INTERNAL_API_KEY = 'your_internal_secret_key';

async function cleanImages() {
    console.log('Starting image cleaning process...');

    const updatedProducts = [];
    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    for (const product of cloudinaryProducts) {
        // console.log(`Processing product ${product.id}...`);

        try {
            // Check if image is already base64 (already cleaned) or empty
            if (!product.image || product.image.startsWith('data:image')) {
                // console.log(`Product ${product.id} already processed or empty. Skipping.`);
                updatedProducts.push(product);
                skipCount++;
                continue;
            }

            console.log(`cleaning... ${product.id}`);

            const response = await axios.post(API_URL, {
                imageUrl: product.image
            }, {
                headers: {
                    'x-api-key': INTERNAL_API_KEY
                }
            });

            if (response.data.success) {
                updatedProducts.push({
                    ...product,
                    image: response.data.cleanImageBase64
                });
                console.log(`success → updated product id ${product.id}`);
                successCount++;
            } else {
                console.error(`error → skip product ${product.id}: API returned success=false`);
                updatedProducts.push(product); // Keep original if failed
                errorCount++;
            }

        } catch (error: any) {
            console.error(`error → skip product ${product.id}:`, error.message);
            updatedProducts.push(product); // Keep original if failed
            errorCount++;
        }

        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Write back to file
    const fileContent = `export const cloudinaryProducts = ${JSON.stringify(updatedProducts, null, 2)};\n`;
    const filePath = path.join(__dirname, '../data/cloudinaryProducts.ts');

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log('------------------------------------------------');
    console.log('All done! cloudinaryProducts.ts has been updated.');
    console.log(`Success: ${successCount}, Errors: ${errorCount}, Skipped: ${skipCount}`);
}

cleanImages();
