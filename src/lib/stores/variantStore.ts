import { writable } from 'svelte/store';
import API from "$lib/services/api";

type VariantFormState = {
  isOpen: boolean;
  editData: any | null;
  isEditMode: boolean;
  productData: any | null;
  isLoading: boolean;
  refreshTrigger: number;
};

function createVariantFormStore() {
  const { subscribe, set, update } = writable<VariantFormState>({
    isOpen: false,
    editData: null,
    isEditMode: false,
    productData: null,
    isLoading: false,
    refreshTrigger: 0
  });

  async function fetchProductData(productId: string) {
    try {
      const response = await API.get(`/products/product/${productId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  }

  return {
    subscribe,
    openNew: async (productId: string) => {
      update(state => ({ ...state, isLoading: true }));
      const productData = await fetchProductData(productId);
      update(state => ({ 
        isOpen: true, 
        editData: null, 
        isEditMode: false, 
        productData,
        isLoading: false,
        refreshTrigger: state.refreshTrigger
      }));
    },
    openEdit: async (editData: any, productId: string) => {
      update(state => ({ ...state, isLoading: true }));
      const productData = await fetchProductData(productId);
      update(state => ({ 
        isOpen: true, 
        editData, 
        isEditMode: true, 
        productData,
        isLoading: false,
        refreshTrigger: state.refreshTrigger
      }));
    },
    close: () => update(state => ({ 
      isOpen: false, 
      editData: null, 
      isEditMode: false, 
      productData: null,
      isLoading: false,
      refreshTrigger: state.refreshTrigger
    })),
    triggerRefresh: () => update(state => ({
        ...state,
        refreshTrigger: state.refreshTrigger + 1
    }))
  };
}

export const variantFormStore = createVariantFormStore();