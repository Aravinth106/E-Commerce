import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createProduct,
    updateProduct,
    getProductById,
} from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "" as number | "",
        stockQuantity: "" as number | "",
        categoryId: "",
        imageUrl: "",
        isActive: true,
    });

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!id) return;

        const productId = parseInt(id, 10);

        if (!isNaN(productId)) {
            loadProduct(productId);
        }
    }, [id]);


    const loadCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    const loadProduct = async (id: number) => {
        const data = await getProductById(id);
        setForm({ ...data, imageUrl: data.imageUrl || "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            ...form,
            price: form.price === "" ? 0 : form.price,
            stockQuantity: form.stockQuantity === "" ? 0 : form.stockQuantity,
        };

        if (id) {
            await updateProduct(id, formData);
        } else {
            await createProduct(formData);
        }

        navigate("/admin/products");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {id ? "Edit Product" : "Create Product"}
            </h2>

            <div className="grid gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={form.stockQuantity}
                    onChange={(e) =>
                        setForm({ ...form, stockQuantity: Number(e.target.value) })
                    }
                    className="border p-2 rounded"
                    required
                />

                <select
                    value={form.categoryId}
                    onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                    }
                    className="border p-2 rounded"
                />

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) =>
                            setForm({ ...form, isActive: e.target.checked })
                        }
                    />
                    <span>Active</span>
                </label>

                <button className="bg-blue-600 text-white p-2 rounded">
                    {id ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
