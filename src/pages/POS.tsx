import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { Product, CartItem } from '../types';
import Checkout from '../components/Checkout';

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Initialize and load products from localStorage on component mount
  React.useEffect(() => {
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (existingProducts.length === 0) {
      const initialProducts: Product[] = [
        { id: '1', name: 'Wireless Mouse', price: 29.99, cost: 15.50, stock: 45, category: 'Electronics', sku: 'WM-001', description: 'Ergonomic wireless mouse' },
        { id: '2', name: 'USB-C Cable', price: 12.99, cost: 6.25, stock: 120, category: 'Electronics', sku: 'UC-002', description: '2-meter USB-C cable' },
        { id: '3', name: 'Laptop Stand', price: 49.99, cost: 28.75, stock: 23, category: 'Accessories', sku: 'LS-003', description: 'Adjustable laptop stand' },
        { id: '4', name: 'Mechanical Keyboard', price: 89.99, cost: 52.30, stock: 15, category: 'Electronics', sku: 'MK-004', description: 'RGB mechanical keyboard' },
        { id: '5', name: 'Desk Lamp', price: 34.99, cost: 18.90, stock: 67, category: 'Accessories', sku: 'DL-005', description: 'LED desk lamp' },
        { id: '6', name: 'Webcam HD', price: 59.99, cost: 35.60, stock: 31, category: 'Electronics', sku: 'WC-006', description: '1080p HD webcam' },
      ];
      localStorage.setItem('products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    } else {
      setProducts(existingProducts);
    }
  }, []);

  const refreshProducts = () => {
    const updatedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(updatedProducts);
  };

  const categories = ['all', 'Electronics', 'Accessories', 'Office', 'Gaming'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.product.price }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, subtotal: product.price }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.product.price }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.08;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCompleteCheckout = (paymentMethod: 'cash' | 'mpesa', customerInfo?: any) => {
    const sale = {
      id: Date.now().toString(),
      customerName: customerInfo?.name || 'Guest',
      customerEmail: customerInfo?.email || '',
      customerPhone: customerInfo?.phone || '',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.subtotal
      })),
      subtotal: calculateTotal(),
      tax: calculateTax(),
      total: calculateGrandTotal(),
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales.push(sale);
    localStorage.setItem('sales', JSON.stringify(existingSales));

    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = existingProducts.map((product: any) => {
      const cartItem = cart.find(item => item.product.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setCart([]);
    setShowCheckout(false);
    refreshProducts();
  };

  const getStockBadgeClass = (stock: number) => {
    return stock > 20
      ? 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-800'
      : 'text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800';
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Register 1</span>
            <span className="text-sm font-medium text-gray-900">John Doe</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Category Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products or scan barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className={getStockBadgeClass(product.stock)}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-lg shadow flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No items in cart</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">${item.product.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateGrandTotal().toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-3 font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Checkout
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        total={calculateTotal()}
        tax={calculateTax()}
        grandTotal={calculateGrandTotal()}
        onComplete={handleCompleteCheckout}
      />
    </>
  );
};

export default POS;
