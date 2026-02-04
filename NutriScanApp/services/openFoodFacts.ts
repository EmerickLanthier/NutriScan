
export interface NutritionRowData {
    label: string;
    value: string;
    unit: string;
    bold?: boolean;
    subItem?: boolean;
}

export interface ProductData {
    barcode: string;
    name: string;
    image: string | null;
    brands: string;
    quantity: string;
    labels: string[];
    nutriscore: string;
    nutritionRows: NutritionRowData[];
}

export const fetchProduct = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await response.json();

        if (data.status === 0 || !data.product) return null;

        const p = data.product;
        const n = p.nutriments || {};

        const rows: NutritionRowData[] = [];

        // Fonction util pour add un row si valeur existe
        const addRow = (key: string, label: string, unit: string, options: {
            bold?: boolean,
            subItem?: boolean,
            force?: boolean
        } = {}) => {
            const val = n[`${key}_100g`];
            // affiche si valeur existe OU si c'est forcé (pour les 7 mandatory)
            if (val !== undefined || options.force) {
                rows.push({
                    label,
                    value: (val || 0).toFixed(key === 'energy-kcal' ? 0 : 1), // Pas de décimale pour les calories
                    unit,
                    bold: options.bold,
                    subItem: options.subItem
                });
            }
        };

        addRow('energy-kcal', 'Énergie', 'kcal', {bold: true, force: true});

        addRow('fat', 'Matières grasses', 'g', {force: true});
        addRow('saturated-fat', 'Dont acides gras saturés', 'g', {subItem: true, force: true});

        addRow('carbohydrates', 'Glucides', 'g', {force: true});
        addRow('sugars', 'Dont sucres', 'g', {subItem: true, force: true});

        // fibres (optionnel : seulement si > 0.5g)
        if (n['fiber_100g'] > 0.1) {
            addRow('fiber', 'Fibres alimentaires', 'g');
        }

        addRow('proteins', 'Protéines', 'g', {force: true});
        addRow('salt', 'Sel', 'g', {force: true});

        if (n['sodium_100g'] && n['sodium_100g'] > 0) addRow('sodium', 'Sodium', 'g');
        if (n['calcium_100g']) addRow('calcium', 'Calcium', 'mg');
        if (n['iron_100g']) addRow('iron', 'Fer', 'mg');
        if (n['vitamin-c_100g']) addRow('vitamin-c', 'Vitamine C', 'mg');


        return {
            barcode: barcode,
            name: p.product_name_fr || p.product_name || "Produit inconnu",
            image: p.image_front_url || p.image_url || null,
            brands: p.brands || "Marque inconnue",
            quantity: p.quantity || "",
            labels: p.labels_tags || [],
            nutriscore: p.nutriscore_grade || "?",
            nutritionRows: rows,
        };

    } catch (error) {
        console.error("Erreur API:", error);
        return null;
    }
};