import { useEffect, useState } from "react";
import {
  getParentCategories,
  getChildCategories,
  getProductsByCategory,
} from "../../services/categoryService";
import { createOrder } from "../../services/orderService";
import type { Category, Product } from "../../types/order.types";
import { useAuthStore } from "../../store/auth.store";

export default function CreateOrder() {
  const [parents, setParents] = useState<Category[]>([]);
  const [children, setChildren] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [parentId, setParentId] = useState("");
  const [childId, setChildId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);
  const userId = useAuthStore((state) => state.userId);


  // Load parent categories
  useEffect(() => {
    getParentCategories().then(setParents);
  }, []);

  // Load child categories
  useEffect(() => {
    if (!parentId) return;
    setChildId("");
    setProducts([]);
    setProduct(null);

    getChildCategories(parentId).then(setChildren);
  }, [parentId]);

  // Load products
  useEffect(() => {
    if (!childId) return;
    setProduct(null);

    getProductsByCategory(childId).then(setProducts);
  }, [childId]);

  const handleSubmit = async () => {
    if (!product) return;

    try {
      setLoading(true);
      await createOrder({
        userId,
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
      });

      alert("Order created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-6">Create New Order</h1>

        {/* Parent Category */}
        <label className="block mb-2 text-sm font-medium">Category</label>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">Select Category</option>
          {parents.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Child Category */}
        <label className="block mb-2 text-sm font-medium">Sub Category</label>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={childId}
          disabled={!parentId}
          onChange={(e) => setChildId(e.target.value)}
        >
          <option value="">Select Sub Category</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Product */}
        <label className="block mb-2 text-sm font-medium">Product</label>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          disabled={!childId}
          onChange={(e) =>
            setProduct(products.find((p) => p.id === e.target.value) || null)
          }
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - ₹{p.price.toLocaleString()}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <label className="block mb-2 text-sm font-medium">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          disabled={!product}
          onChange={(e) => setQuantity(+e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Total */}
        {product && (
          <div className="mb-6 text-sm font-semibold">
            Total: ₹ {(product.price * quantity).toLocaleString()}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!product || loading}
          className="w-full bg-[#1a56db] hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>
    </div>
  );
}
