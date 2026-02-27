import { ProductData } from './openFoodFacts';

const API_URL = `${process.env.NUTRISCAN_API_URL}/product/scan`

export const addToHistory = async (product: ProductData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product),
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur backend:", error);
    }
}