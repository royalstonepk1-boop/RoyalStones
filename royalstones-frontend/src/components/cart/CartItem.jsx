export default function CartItem({ item, onRemove }) {
    const product = item.productId;
  
    return (
      <div className="flex justify-between border-b py-3">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p>Qty: {item.quantity}</p>
          <p>Rs {product.price}</p>
        </div>
  
        <button
          className="text-red-600"
          onClick={() => onRemove(product._id)}
        >
          Remove
        </button>
      </div>
    );
  }
  