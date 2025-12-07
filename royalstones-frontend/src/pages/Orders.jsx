import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";

export default function Orders() {
  const { orders, fetchMyOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((o) => (
        <div key={o._id} className="border p-3 mb-3">
          <p>Status: {o.status}</p>
          <p>Total: Rs {o.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}
