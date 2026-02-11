import { useEffect, useState } from "react";
import {
  createProduct,
  getProductsPaged,
  deleteProduct,
} from "../../services/productService";
import { getParentCategories } from "../../services/categoryService";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: "",
  });

  const loadProducts = async () => {
    const data = await getProductsPaged();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    getParentCategories().then(setCategories);
  }, []);

  const handleCreate = async () => {
    await createProduct(form);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Product Management</h1>

      {/* Create Form */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-2 gap-4">
        <input
          placeholder="Name"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />
        <input
          placeholder="Stock"
          type="number"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, stockQuantity: Number(e.target.value) })
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="col-span-2 bg-blue-600 text-white py-2 rounded"
        >
          Create Product
        </button>
      </div>

      {/* List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock_quantity}</td>
                <td>
                  {p.is_active ? "Active" : "Inactive"}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
