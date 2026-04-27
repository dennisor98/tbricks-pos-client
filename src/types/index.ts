export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  sku: string;
  description?: string;
  image?: string;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  timestamp: Date;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  topProducts: Product[];
  salesByCategory: { category: string; amount: number }[];
  salesByPayment: { method: string; count: number; amount: number }[];
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  status: 'low' | 'out' | 'critical';
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this should be hashed
  role: 'super_user' | 'tenant_admin' | 'staff';
  tenantId?: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  isActive: boolean;
}
