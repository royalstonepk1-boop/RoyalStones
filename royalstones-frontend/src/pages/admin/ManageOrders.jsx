import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { status });
    loadOrders();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {orders.map((o) => (
        <div
          key={o._id}
          className="border p-4 mb-4 rounded"
        >
          <p><b>Order ID:</b> {o._id}</p>
          <p><b>User:</b> {o.userId?.email}</p>
          <p><b>Total:</b> Rs {o.totalAmount}</p>
          <p><b>Status:</b> {o.status}</p>

          <select
            className="border p-2 mt-2"
            onChange={(e) =>
              updateStatus(o._id, e.target.value)
            }
          >
            <option>pending</option>
            <option>processing</option>
            <option>shipped</option>
            <option>completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
