import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
    const productId = url.searchParams.get('product');
    
    if (!productId) {
        throw error(400, {
            message: 'Product ID is required'
        });
    }

    return {
        productId
    };
};