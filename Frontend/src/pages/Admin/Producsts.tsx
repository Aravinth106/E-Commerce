import { useEffect, useState } from "react";
import { getAdminProducts } from "../../services/productService";
import type { ProductAdmin } from "../../types/Product.types";
import { getAllCategories } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);

  const loadProducts = async () => {
    const result = await getAdminProducts({
      search: search || undefined,
      categoryId,
      isActive,
      page,
      pageSize,
    });

    setProducts(result.items);
    setTotalCount(result.totalCount);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, categoryId, isActive, page]);

  useEffect(() => {
    console.log("products", products);
  }, [products]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded"
        />

        <select
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value || undefined);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setPage(1);
            const val = e.target.value;
            if (val === "") setIsActive(undefined);
            else setIsActive(val === "true");
          }}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.categoryName}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.stockQuantity}</td>
              <td className="p-3">
                {p.isActive ? "Active" : "Inactive"}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() =>
                    navigate(`/admin/products/edit/${p.id}`)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
