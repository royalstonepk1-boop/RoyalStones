import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 space-y-3">
        <Link to="/admin/products" className="block underline">
          Manage Products
        </Link>
        <Link to="/admin/categories" className="block underline">
          Manage Categories
        </Link>
      </div>
    </div>
  );
}
