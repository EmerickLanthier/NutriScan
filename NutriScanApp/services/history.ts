import { fetchProduct, ProductData } from './openFoodFacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL_SCAN = `${process.env.EXPO_PUBLIC_API_URL}/product/scan`
export const API_URL_HISTORY = `${process.env.EXPO_PUBLIC_API_URL}/product/history`

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

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

export const getHistoryData = async (
    sortBy?: 'last_updated' | 'nutriscore' | null,
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = ''
) => {
    try {
        const headers = await getAuthHeaders();
        let url = API_URL_HISTORY;

        if (sortBy) {
            url += `?sortBy=${sortBy}&order=${sortOrder}`;
        }

        if (search) {
            url += `?search=${encodeURIComponent(search)}&`;
        }

        if (url.endsWith('&') || url.endsWith('?')) {
            url = url.slice(0, -1);
        }
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur réseau lors de la récupération de l'historique:", error);
        return [];
    }
};

export const toggleFavorite = async (id: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL_HISTORY}/${id}/favorite`, {
        method: 'POST',
        headers
    });
    return await response.json();
};

export const getProductFromDB = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/product/details/${barcode}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Erreur récupération produit DB:", error);
        return null;
    }
};

export const getFullProductDetails = async (barcode: string): Promise<ProductData | null> => {
    let product = await getProductFromDB(barcode);

    if (product) {
        console.log("Produit trouvé dans notre BD locale !");
        const { _id, __v, ...cleanProductData } = product as any;
        await addToHistory(cleanProductData as ProductData);
        return product;
    }

    console.log("Produit non trouvé en BD, appel à OpenFoodFacts...");
    product = await fetchProduct(barcode);

    if (product) {
        await addToHistory(product);
    }

    return product;
};