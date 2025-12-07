export default function Footer() {
    return (
      <footer className="bg-black text-white mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-6 py-10">
          
          {/* About */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Royal Stones</h2>
            <p className="text-sm text-gray-400">
              Premium gemstones and jewelry store. Trusted quality and luxury craftsmanship.
            </p>
          </div>
  
          {/* Links */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>Home</li>
              <li>Shop</li>
              <li>Cart</li>
              <li>Orders</li>
            </ul>
          </div>
  
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <p className="text-sm text-gray-400">Lahore, Pakistan</p>
            <p className="text-sm text-gray-400">support@royalstones.com</p>
            <p className="text-sm text-gray-400">+92 300 1234567</p>
          </div>
        </div>
  
        <div className="text-center text-xs bg-gray-900 py-3">
          © {new Date().getFullYear()} Royal Stones. All rights reserved.
        </div>
      </footer>
    );
  }
  