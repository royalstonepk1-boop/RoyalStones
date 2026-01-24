import { useNavigate } from 'react-router-dom';
import FooterImg1 from '../../Images/Group-1.png';
import FooterImg2 from '../../Images/Group-2.png';
import FooterImg3 from '../../Images/Group-3.png';
import TIKTOK from '../../Images/tiktok.png';
import FB from '../../Images/fb.png';
import YT from '../../Images/youtube.png';
import EMAIL from '../../Images/gmail.png';

export default function Footer() {
  const navigate = useNavigate();
  const open=(link)=>{
    window.open(link,'_blank');
  }
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
          <img src={FB} width={45} height={45} className='mx-4' onClick={()=>open('https://www.facebook.com/share/1Y8Rxen3kp/')}/>
          <img src={TIKTOK} width={45} height={45} className='mx-4' onClick={()=>open('https://www.tiktok.com/@royal_stone1?_r=1&_t=ZS-91kp31807kr')}/>
          <img src={YT} width={45} height={45} className='mx-4' onClick={()=>open('https://youtube.com/@royal_stone_asad_ullah?si=O9s7qR4Su3cxo7GY')}/>
          <img src={EMAIL} width={45} height={45} className='mx-4' onClick={()=>open('mailto:royalstonepk1@gmail.com')}/>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-6 py-10">

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Information</h2>
          <ul className="text-sm text-gray-500 space-y-1">
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/about')}>About Stones</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/delivery')}>Delivery Information</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/privacy')}>Privacy Policy</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/terms')}>Terms & Conditions</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/')}>Home</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/shop')}>Shop</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/card')}>Cart</li>
            <li className="hover:text-gray-800 cursor-pointer transform duration-150" onClick={()=>navigate('/orders')}>Orders</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-sm text-gray-400 mb-2">Raj Royal jeweller, Nai Abadi Road, Chaki Stop, Barakhau, Islamabad, Pakistan</p>
          <p className="text-sm text-gray-400">+92-315-5066472</p>
          <p className="text-sm text-gray-400">royalstonepk1@gmail.com</p>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full h-64 my-4 relative overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.34397053054454!2d73.18327763868763!3d33.74765196628845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfc3695a61e0b9%3A0x5ea18dfc495f35ab!2sRaj%20Royal%20jeweller!5e0!3m2!1sen!2s!4v1765623602400!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="opacity-100"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
            </div>
      <div className="text-center text-xs py-3 text-gray-500">
        © {new Date().getFullYear()} Royal Stones. All rights reserved.
      </div>
    </footer>
  );
}
