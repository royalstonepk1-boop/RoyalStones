import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";

export default function Orders() {
  const { orders, fetchMyOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">When you place orders, they will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order # RSSJ{order.orderNumber || 'N/A'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase()+ order.status.slice(1) || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rs {order.totalAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">
                      Order Items ({order.orderItems.length})
                    </p>
                    <div className="space-y-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {item.name || item.productId?.name || 'Product'} x {item.quantity || 1} ({(item.carretValue || 0)} Carret { item.fingerSize && `, Finger Size: ${item.fingerSize || 'N/A'}`})
                          </span>
                          <span className="text-gray-900 font-medium">
                            Rs {((item.price || 0) * (item.quantity || 1) * (item.carretValue || 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              

                {order.shippingAddress && (
                  <div>
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">Shipping Address</p>
                    <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                      {order.shippingAddress.country && `${order.shippingAddress.country} `}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      Delivery Charges: Rs {order.deliveryCharges ? order.deliveryCharges.toLocaleString() : '0'}
                    </p>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}