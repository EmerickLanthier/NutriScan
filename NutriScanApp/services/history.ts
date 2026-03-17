import { ProductData } from './openFoodFacts';

export const API_URL_SCAN = `${process.env.EXPO_PUBLIC_API_URL}/product/scan`
export const API_URL_HISTORY = `${process.env.EXPO_PUBLIC_API_URL}/product/history`

export const addToHistory = async (product: ProductData) => {
    try {
        const response = await fetch(API_URL_SCAN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product),
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur backend:", error);
    }
}

export const deleteHistoryItem = async (id: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL_HISTORY}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur backend suppression:", errorData.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Erreur réseau lors de la suppression:", error);
        return false;
    }
};