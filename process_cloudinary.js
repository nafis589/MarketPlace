const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'asset_folder.json');
const OUTPUT_FILE = path.join(__dirname, 'data', 'cloudinaryProducts.ts');

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function singularize(s) {
    if (!s) return '';
    if (s.toLowerCase().endsWith('s') && s.length > 3) {
        return s.slice(0, -1);
    }
    return s;
}

function generateTitle(genderRaw, category, type, folder) {
    // Priority: Type > Category > Folder
    let base = type || category || folder || "Produit";

    // Handle specific overrides based on prompt examples
    if (base.toLowerCase() === 'brands') return "Image de marque";
    if (base.toLowerCase() === 'logos') return "Logo marque";

    // Clean up
    base = base.replace(/[_-]/g, ' ');
    base = singularize(base);
    base = capitalize(base);

    // Append gender if applicable
    const genderLower = genderRaw.toLowerCase();
    if ((genderLower === 'homme' || genderLower === 'femme') && !base.toLowerCase().includes(genderLower)) {
        base = `${base} ${genderLower}`;
    }

    return base;
}

function processCloudinaryData() {
    try {
        if (!fs.existsSync(INPUT_FILE)) {
            console.error(`Error: ${INPUT_FILE} not found.`);
            return;
        }

        const rawContent = fs.readFileSync(INPUT_FILE, 'utf8');
        if (!rawContent.trim()) {
            console.error("Error: Input file is empty.");
            return;
        }

        let data;
        try {
            data = JSON.parse(rawContent);
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            return;
        }

        // Normalize to array
        let items = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (data.resources && Array.isArray(data.resources)) {
            items = data.resources;
        } else {
            // Try to find any array
            const keys = Object.keys(data);
            for (const k of keys) {
                if (Array.isArray(data[k])) {
                    items = data[k];
                    break;
                }
            }
        }

        if (items.length === 0) {
            console.log("No items found to process.");
            return;
        }

        const products = items
            .filter(item => item.asset_folder && item.asset_folder.trim() !== "")
            .map(item => {
                const folder = item.asset_folder;
                const parts = folder.split('/');

                const rawGender = parts[0] || "";
                const genderLower = rawGender.toLowerCase();

                // Determine standardized gender
                let gender = 'other';
                if (genderLower === 'homme' || genderLower === 'femme') {
                    gender = genderLower;
                }

                const category = parts.length > 1 ? parts[1] : null;
                const type = parts.length > 2 ? parts[2] : null;

                const title = generateTitle(rawGender, category, type, folder);

                return {
                    id: item.asset_id,
                    title: title,
                    gender: gender,
                    category: category,
                    type: type,
                    image: item.secure_url,
                    folder: folder
                };
            });

        // Create output directory if it doesn't exist
        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileContent = `export const cloudinaryProducts = ${JSON.stringify(products, null, 2)};`;
        fs.writeFileSync(OUTPUT_FILE, fileContent);

        console.log(`Success! Processed ${items.length} items. Generated ${products.length} valid products.`);
        console.log(`Output saved to: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("An unexpected error occurred:", error);
    }
}

processCloudinaryData();
