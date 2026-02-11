import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types/Category.types";

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

  const renderTree = (nodes: Category[], level = 0) => {
    return nodes.map((cat) => (
      <div key={cat.id} className="mb-2">
        <div
          className="flex items-center justify-between bg-gray-100 p-2 rounded"
          style={{ marginLeft: level * 20 }}
        >
          <div className="flex items-center gap-2">
            {cat.children && cat.children.length > 0 && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="text-sm"
              >
                {expanded[cat.id] ? "▼" : "▶"}
              </button>
            )}

            {editingId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border px-2 py-1 text-sm"
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="text-green-600 text-sm"
                >
                  Save
                </button>
              </>
            ) : (
              <span className="font-medium">{cat.name}</span>
            )}
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => {
                setParentId(cat.id);
                setNewCategoryName("");
              }}
              className="text-blue-600"
            >
              Add Child
            </button>

            <button
              onClick={() => {
                setEditingId(cat.id);
                setEditName(cat.name);
              }}
              className="text-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {expanded[cat.id] &&
          cat.children &&
          renderTree(cat.children, level + 1)}
      </div>
    ));
  };

  /* ===============================
     UI
  ================================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Category Management</h1>

      {/* Create Category */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="font-medium mb-2">
          {parentId ? "Add Sub Category" : "Add Root Category"}
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>

          {parentId && (
            <button
              onClick={() => setParentId(null)}
              className="text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <div className="bg-white p-4 shadow rounded">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
        ) : (
          renderTree(categories)
        )}
      </div>
    </div>
  );
}
