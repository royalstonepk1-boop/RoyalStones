export default function CartSummary({ cart }) {
    if (!cart || !cart.items) return null;
  
    const total = cart.items.reduce(
      (sum, item) =>
        sum + item.productId.price * item.quantity,
      0
    );
  
    return (
      <div className="border p-4 rounded bg-gray-50 mt-6">
        <h2 className="text-xl font-semibold mb-3">
          Order Summary
        </h2>
  
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {item.productId.name} × {item.quantity}
            </span>
            <span>
              Rs {item.productId.price * item.quantity}
            </span>
          </div>
        ))}
  
        <hr className="my-3" />
  
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rs {total}</span>
        </div>
      </div>
    );
  }
  