import { useEffect, useState } from "react";
import { getAdminProducts } from "../../services/productService";
import type { ProductAdmin } from "../../types/Product.types";
import { getAllCategories } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Package, Edit3, ChevronLeft, ChevronRight } from "lucide-react";

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
  <div className="p-8 bg-slate-50/50 min-h-screen font-sans antialiased text-slate-900">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Product Catalog</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your inventory, pricing, and stock status.</p>
      </div>
      
      <button 
        onClick={() => navigate("/admin/products/create")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>
    </div>

    {/* Filters Section */}
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-6 flex flex-wrap lg:flex-nowrap gap-4 items-center">
      <div className="relative grow min-w-62.5 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search product name or SKU..." 
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 grow lg:grow-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            onChange={(e) => { setPage(1); setCategoryId(e.target.value || undefined); }}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <select
          onChange={(e) => {
            setPage(1);
            const val = e.target.value;
            setIsActive(val === "" ? undefined : val === "true");
          }}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>

    {/* Table Section */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{p.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">ID: #{p.id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {p.categoryName}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[15px] font-bold text-slate-900">₦ {p.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-sm font-bold ${p.stockQuantity < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {p.stockQuantity} in stock
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${p.stockQuantity < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(p.stockQuantity, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`
                    px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center w-fit gap-2 border
                    ${p.isActive 
                      ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                      : "text-slate-500 bg-slate-50 border-slate-200"}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-2 text-sm font-bold"
                  >
                    <Edit3 size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-slate-500 font-medium">
          Showing page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <div className="flex gap-1">
            {/* You could map a range of numbers here for better professional feel */}
            <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100">
              {page}
            </span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
