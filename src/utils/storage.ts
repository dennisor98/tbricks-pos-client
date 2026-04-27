import { Product, Sale, CartItem } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'pos_products',
  SALES: 'pos_sales',
  SETTINGS: 'pos_settings',
};

export const storageUtils = {
  // Products
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  // Sales
  saveSales: (sales: Sale[]) => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  getSales: (): Sale[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (data) {
      return JSON.parse(data).map((sale: any) => ({
        ...sale,
        timestamp: new Date(sale.timestamp)
      }));
    }
    return [];
  },

  addSale: (sale: Sale) => {
    const sales = storageUtils.getSales();
    sales.push(sale);
    storageUtils.saveSales(sales);
  },

  // Settings
  saveSettings: (settings: any) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
