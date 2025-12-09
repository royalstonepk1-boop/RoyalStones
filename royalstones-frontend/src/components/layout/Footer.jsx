import FooterImg1 from '../../Images/Group-1.png';
import FooterImg2 from '../../Images/Group-2.png';
import FooterImg3 from '../../Images/Group-3.png';
export default function Footer() {
  return (
    <footer className="bg-white text-black mt-10">
      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-18 text-center bg-[#333333] py-4 md:py-7 text-white">
        <div className="flex flex-row items-center gap-2">
          <img src={FooterImg1} alt="Craft" className="w-20 h-20 object-contain" />
          <div className='text-start'>
            <p className="font-semibold text-lg">Perfect Craftsmanship</p>
            <p className="text-sm text-gray-400">
              Our all jewelry is made with real 925 silver.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <img src={FooterImg2} alt="Gemstone" className="w-20 h-20 object-contain" />
          <div className='text-start'>
            <p className="font-semibold text-lg">Natural Gemstones</p>
            <p className="text-sm text-gray-400">
              All our gemstones are lab certified.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <img src={FooterImg3} alt="Refund" className="w-20 h-20 object-contain" />
          <div className='text-start'>
            <p className="font-semibold text-lg">Money Back Guarantee</p>
            <p className="text-sm text-gray-400">
              7 days money back guarantee.
            </p>
          </div>
        </div>

      </div>

      <div>
        <div className='[&>i]:mx-2 text-2xl flex justify-center mt-2 py-4 [&>i]:px-2 text-gray-500 [&>i]:hover:text-gray-800 cursor-pointer transform duration-150'>
          <i class="bi bi-facebook"></i>
          <i class="bi bi-instagram"></i>
          <i class="bi bi-youtube"></i>
          <i class="bi bi-envelope"></i>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-6 py-10">

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Information</h2>
          <ul className="text-sm text-gray-500 space-y-1">
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">About Us</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Delivery Information</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Privacy Policy</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Terms & Conditions</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Home</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Shop</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Cart</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150">Orders</li>
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

      <div className="text-center text-xs py-3 text-gray-500">
        © {new Date().getFullYear()} Royal Stones. All rights reserved.
      </div>
    </footer>
  );
}
