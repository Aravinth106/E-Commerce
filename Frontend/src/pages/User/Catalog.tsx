import { useEffect, useMemo, useState } from "react";
import {
    getAllCategories,
    getAllProducts,
    getProductsByCategory,
} from "../../services/categoryService";
import type { Product } from "../../types/Product.types";
import { RotateCcw, ShoppingCart, Trash2, Plus } from "lucide-react"; // Optional: lucide-react for icons
import { createOrder } from "../../services/orderService";
import { useAuthStore } from "../../store/auth.store";
import type { Category } from "../../types/Category.types";

interface CartItem extends Product {
    quantity: number;
}

const Catalog = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    // const [product, setProduct] = useState<Product | null>(null);
    // const [quantity, setQuantity] = useState(1);

    const userId = useAuthStore((state) => state.userId);


    // Split categories
    const parentCategories = useMemo(
        () => categories.filter((c) => c.parentId === null),
        [categories]
    );

    const childCategories = useMemo(
        () => categories.filter((c) => c.parentId === selectedParent),
        [categories, selectedParent]
    );

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [categoryData, productData] = await Promise.all([
                getAllCategories(),
                getAllProducts(),
            ]);

            setCategories(categoryData);
            setProducts(productData);
            setSelectedParent(null);
            setSelectedChild(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleParentChange = (parentId: string) => {
        setSelectedParent(parentId);
        setSelectedChild(null);
        setProducts([]); // wait for child selection
    };

    const handleChildChange = async (childId: string) => {
        setSelectedChild(childId);

        try {
            const data = await getProductsByCategory(childId);
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ---------------- CART LOGIC ----------------

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!userId) {
            alert("User not authenticated");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                userId,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            await createOrder(payload);

            alert("Order created successfully");

            setCart([]);
        } catch (err) {
            console.error(err);
            // setError("Failed to create order");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex h-screen bg-[#F8F9FC] text-slate-700 font-sans">

            {/* LEFT SECTION - PRODUCT DISCOVERY */}
            <div className="w-3/4 p-8 overflow-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Create New Order</h1>
                    <p className="text-slate-500 text-sm">Select categories and add items to the customer's cart.</p>
                </header>

                {/* Filters Bar */}
                <div className="flex items-center gap-3 mb-8 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex-1 flex gap-3">
                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all"
                            value={selectedParent ?? ""}
                            onChange={(e) => handleParentChange(e.target.value)}
                        >
                            <option value="">All Parent Categories</option>
                            {parentCategories.map((parent) => (
                                <option key={parent.id} value={parent.id}>{parent.name}</option>
                            ))}
                        </select>

                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none disabled:opacity-50 transition-all"
                            value={selectedChild ?? ""}
                            onChange={(e) => handleChildChange(e.target.value)}
                            disabled={!selectedParent}
                        >
                            <option value="">Select Child Category</option>
                            {childCategories.map((child) => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={loadInitialData}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">
                                {selectedParent ? "Please select a sub-category to view products" : "No products found in this category"}
                            </p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-full h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 transition-colors">
                                        {/* Placeholder for Product Image */}
                                        <ShoppingCart size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-blue-600 font-bold text-lg mb-4">₹ {product.price.toLocaleString()}</p>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors active:scale-95"
                                >
                                    <Plus size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SECTION - CART (SIDEBAR) */}
            <div className="w-1/4 bg-white border-l border-slate-200 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Current Order</h2>
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <ShoppingCart size={48} className="mb-4" />
                            <p className="text-sm font-medium">Your cart is currently empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="group relative bg-slate-50 rounded-xl p-3 border border-transparent hover:border-slate-200 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-slate-800 text-sm pr-6 leading-tight">{item.name}</span>
                                        <span className="font-bold text-slate-900 text-sm">₹ {item.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Subtotal</span>
                                <span>₹ {totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-slate-900 font-bold text-xl pt-2 border-t border-slate-200">
                                <span>Total</span>
                                <span>₹ {totalAmount}</span>
                            </div>
                        </div>

                        {/* <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0">
            Complete Order
          </button> */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? "Placing Order..." : "Proceed to Order"}
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
