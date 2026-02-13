import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types/Category.types";
import { ChevronDown, ChevronRight, Save, X, Plus, Pencil, Trash2, FolderTree, Layers } from "lucide-react";

/* ===============================
   Helper: Build Tree (if flat list)
================================= */

const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  map.forEach((cat) => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      parent?.children?.push(cat);
    } else {
      roots.push(cat);
    }
  });

  return roots;
};

/* ===============================
   Component
================================= */

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  /* ===============================
     Load Categories
  ================================= */

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      const tree = buildCategoryTree(data);
      setCategories(tree);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ===============================
     Toggle Expand
  ================================= */

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ===============================
     Create Category
  ================================= */

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({
        name: newCategoryName,
        parentId,
      });

      setNewCategoryName("");
      setParentId(null);
      fetchCategories();
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  /* ===============================
     Update Category
  ================================= */

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      await updateCategory(id, { name: editName });
      setEditingId(null);
      setEditName("");
      fetchCategories();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  /* ===============================
     Delete Category
  ================================= */

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ===============================
     Render Tree Recursively
  ================================= */

  // const renderTree = (nodes: Category[], level = 0) => {
  //   return nodes.map((cat) => (
  //     <div key={cat.id} className="mb-2">
  //       <div
  //         className="flex items-center justify-between bg-gray-100 p-2 rounded"
  //         style={{ marginLeft: level * 20 }}
  //       >
  //         <div className="flex items-center gap-2">
  //           {cat.children && cat.children.length > 0 && (
  //             <button
  //               onClick={() => toggleExpand(cat.id)}
  //               className="text-sm"
  //             >
  //               {expanded[cat.id] ? "▼" : "▶"}
  //             </button>
  //           )}

  //           {editingId === cat.id ? (
  //             <>
  //               <input
  //                 value={editName}
  //                 onChange={(e) => setEditName(e.target.value)}
  //                 className="border px-2 py-1 text-sm"
  //               />
  //               <button
  //                 onClick={() => handleUpdate(cat.id)}
  //                 className="text-green-600 text-sm"
  //               >
  //                 Save
  //               </button>
  //             </>
  //           ) : (
  //             <span className="font-medium">{cat.name}</span>
  //           )}
  //         </div>

  //         <div className="flex gap-2 text-sm">
  //           <button
  //             onClick={() => {
  //               setParentId(cat.id);
  //               setNewCategoryName("");
  //             }}
  //             className="text-blue-600"
  //           >
  //             Add Child
  //           </button>

  //           <button
  //             onClick={() => {
  //               setEditingId(cat.id);
  //               setEditName(cat.name);
  //             }}
  //             className="text-yellow-600"
  //           >
  //             Edit
  //           </button>

  //           <button
  //             onClick={() => handleDelete(cat.id)}
  //             className="text-red-600"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       </div>

  //       {expanded[cat.id] &&
  //         cat.children &&
  //         renderTree(cat.children, level + 1)}
  //     </div>
  //   ));
  // };

  // /* ===============================
  //    UI
  // ================================= */

  // return (
  //   <div className="p-6">
  //     <h1 className="text-2xl font-semibold mb-4">Category Management</h1>

  //     {/* Create Category */}
  //     <div className="mb-6 bg-white p-4 shadow rounded">
  //       <h2 className="font-medium mb-2">
  //         {parentId ? "Add Sub Category" : "Add Root Category"}
  //       </h2>

  //       <div className="flex gap-2">
  //         <input
  //           type="text"
  //           placeholder="Category Name"
  //           value={newCategoryName}
  //           onChange={(e) => setNewCategoryName(e.target.value)}
  //           className="border px-3 py-2 rounded w-64"
  //         />

  //         <button
  //           onClick={handleCreate}
  //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  //         >
  //           Create
  //         </button>

  //         {parentId && (
  //           <button
  //             onClick={() => setParentId(null)}
  //             className="text-gray-600"
  //           >
  //             Cancel
  //           </button>
  //         )}
  //       </div>
  //     </div>

  //     {/* Tree */}
  //     <div className="bg-white p-4 shadow rounded">
  //       {categories.length === 0 ? (
  //         <p className="text-gray-500">No categories found</p>
  //       ) : (
  //         renderTree(categories)
  //       )}
  //     </div>
  //   </div>
  // );
const renderTree = (nodes: Category[], level = 0) => {
  return nodes.map((cat) => (
    <div key={cat.id} className="relative">
      <div
        className={`
          group flex items-center justify-between p-3 rounded-xl mb-1 transition-all
          ${level === 0 ? 'bg-white border border-slate-200' : 'bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white'}
        `}
        style={{ marginLeft: level * 28 }}
      >
        <div className="flex items-center gap-3">
          {/* Tree Line Connector for nested items */}
          {level > 0 && (
            <div className="absolute -left-4 top-1/2 w-4 h-px bg-slate-200" />
          )}

          {/* Expand/Collapse Toggle */}
          <div className="w-6 flex justify-center">
            {cat.children && cat.children.length > 0 ? (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
              >
                {expanded[cat.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            )}
          </div>

          {/* Name & Inline Edit */}
          <div className="flex items-center gap-2">
            {editingId === cat.id ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border-2 border-blue-500 px-3 py-1 text-sm rounded-lg outline-none shadow-sm"
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm transition-colors"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <span className={`text-sm ${level === 0 ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                {cat.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions - Hidden by default, visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setParentId(cat.id);
              setNewCategoryName("");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add Sub-category"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => {
              setEditingId(cat.id);
              setEditName(cat.name);
            }}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Name"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => handleDelete(cat.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Recursive Children rendering */}
      <div className={`${expanded[cat.id] ? 'block' : 'hidden'} border-l-2 border-slate-100 ml-3`}>
        {cat.children && renderTree(cat.children, level + 1)}
      </div>
    </div>
  ));
};

return (
  <div className="p-8 bg-slate-50 min-h-screen font-sans antialiased text-slate-900">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
          <FolderTree size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Category Management</h1>
          <p className="text-sm text-slate-500">Organize your catalog with multi-level hierarchies.</p>
        </div>
      </div>

      {/* Create Category Section */}
      <div className={`
        mb-10 p-6 rounded-2xl border transition-all duration-300
        ${parentId ? 'bg-blue-50 border-blue-200 shadow-md ring-4 ring-blue-500/5' : 'bg-white border-slate-200 shadow-sm'}
      `}>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className={parentId ? 'text-blue-600' : 'text-slate-400'} />
          <h2 className="font-bold text-slate-800">
            {parentId ? "Adding Sub-category" : "Create Root Category"}
          </h2>
          {parentId && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
              Sub-mode
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <input
              type="text"
              placeholder="Enter category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              {parentId ? "Add Sub-item" : "Create Category"}
            </button>

            {parentId && (
              <button
                onClick={() => setParentId(null)}
                className="px-4 py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tree Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Hierarchy View</h3>
          <span className="text-xs text-slate-400 font-medium">Total categories: {categories.length}</span>
        </div>

        <div className="space-y-1">
          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderTree className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium italic">Your category tree is empty.</p>
            </div>
          ) : (
            renderTree(categories)
          )}
        </div>
      </div>
    </div>
  </div>
);

}
