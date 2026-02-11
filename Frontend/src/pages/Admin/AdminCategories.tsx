import { useEffect, useState } from "react";
import {
  getAllCategories,
  getParentCategories,
  createCategory,
} from "../../services/categoryService";

interface Category {
  id: string;
  name: string;
  parent_id?: string | null;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parents, setParents] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  const loadData = async () => {
    const all = await getAllCategories();
    const parentList = await getParentCategories();
    setCategories(all);
    setParents(parentList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!name) return;

    await createCategory({
      name,
      parentId: parentId || null,
    });

    setName("");
    setParentId("");
    loadData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Category Management</h1>

      {/* Create Form */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          placeholder="Category name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">Parent Category (optional)</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Category
        </button>
      </div>

      {/* List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Name</th>
              <th>Parent</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{c.name}</td>
                <td>
                  {c.parent_id
                    ? parents.find((p) => p.id === c.parent_id)?.name
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
