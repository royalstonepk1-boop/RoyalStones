import { useEffect, useState } from "react";
import {
  adminCreateProduct,
  adminDeleteProduct,
} from "../../api/admin.product.api";
import { fetchProducts } from "../../api/product.api";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});

  const load = () =>
    fetchProducts().then((res) => setProducts(res.data));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    await adminCreateProduct(fd);
    load();
  };

  const del = async (id) => {
    await adminDeleteProduct(id);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="grid gap-2 mb-6 max-w-md">
        <input
          className="border p-2"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          className="border p-2"
          placeholder="Price"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
        <input
          type="file"
          multiple
          onChange={(e) =>
            setForm({ ...form, images: e.target.files[0] })
          }
        />
        <button
          className="bg-black text-white py-2"
          onClick={create}
        >
          Create
        </button>
      </div>

      {products.map((p) => (
        <div
          key={p._id}
          className="flex justify-between border-b py-2"
        >
          {p.name} - Rs {p.price}
          <button
            className="text-red-600"
            onClick={() => del(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
