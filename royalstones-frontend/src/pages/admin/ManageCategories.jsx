import { useState, useEffect } from "react";
import {
  adminCreateCategory,
  adminDeleteCategory,
} from "../../api/admin.category.api";
import { fetchCategories } from "../../api/category.api";

export default function ManageCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const load = () =>
    fetchCategories().then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await adminCreateCategory(name);
    setName("");
    load();
  };

  const remove = async (id) => {
    await adminDeleteCategory(id);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      <div className="flex gap-3 mb-5">
        <input
          className="border p-2"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-black text-white px-4" onClick={create}>
          Add
        </button>
      </div>

      {categories.map((c) => (
        <div
          key={c._id}
          className="flex justify-between border-b py-2"
        >
          {c.name}
          <button
            className="text-red-600"
            onClick={() => remove(c._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
