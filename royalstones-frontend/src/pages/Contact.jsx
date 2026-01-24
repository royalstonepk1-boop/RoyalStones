import PageWrapper from "../util/PageWrapper"

export default function Contact() {
    return (
        <PageWrapper>
        <div className="min-h-screen">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 text-gray-600 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Find Us
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-500">
                        Royal Stones
                    </h2>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Location */}
                    <div className=" rounded-lg p-6 border border-gray-400 bg-gray-200 hover:border-amber-500 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="mt-[-10px] p-3 rounded-full">
                                <i className="bi bi-geo-alt text-amber-500 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-lg">OUR LOCATION</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                Raj Royal jeweller, Nai Abadi Road, Chaki Stop, Barakhau, Islamabad, Pakistan
                                </p>
                                <p className="text-gray-400 text-sm mt-3">
                                    <i className="bi bi-clock mr-2"></i>
                                    Monday-Sunday<br />
                                    <span className="ml-6">10:00 AM-8:00 PM</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className=" rounded-lg p-6 border border-gray-400 bg-gray-200 hover:border-amber-500 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="mt-[-10px] p-3 rounded-full">
                                <i className="bi bi-envelope text-amber-500 text-xl"></i>
                            </div>
                            <div>
                                <h3 className=" font-semibold mb-2 text-lg">Email Us</h3>
                                <a href="mailto:royalstonepk1@gmail.com" className="text-gray-400 hover:text-amber-500 text-sm block mb-2">
                                    royalstonepk1@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Phone & WhatsApp */}
                    <div className="rounded-lg p-6 border border-gray-400 bg-gray-200 hover:border-amber-500 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="mt-[-10px] p-3 rounded-full">
                                <i className="bi bi-telephone text-amber-500 text-2xl"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-lg">Call & WhatsApp</h3>
                                <a href="tel:+923155066472" className="text-gray-400 hover:text-amber-500 text-sm block mb-2">
                                    <i className="bi bi-phone mr-2"></i>+92-315-5066472
                                </a>
                                <a href="https://wa.me/923155066472" className="text-gray-400 hover:text-amber-500 text-sm block">
                                    <i className="bi bi-whatsapp mr-2"></i>+92-315-5066472
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guarantee Section */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        We <span className="text-amber-500">guarantee</span> the security
                    </h2>
                    <p className="text-xl md:text-2xl">
                        and protection of your deposits
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Free Shipping */}
                    <div className=" rounded-lg p-8 border border-gray-400 bg-gray-200 text-center hover:border-amber-500 transition-all hover:transform hover:scale-105">
                        <div className=" w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bi bi-truck text-amber-500 text-5xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Comfortable Shipping</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                        Royal Stones Offers Online Shopping In Pakistan With Comfortable Shipping Charges & Option To Pay Cash On Delivery All Over Pakistan
                        </p>
                    </div>

                    {/* Easy Returns */}
                    <div className=" rounded-lg p-8 border border-gray-400 bg-gray-200 text-center hover:border-amber-500 transition-all hover:transform hover:scale-105">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bi bi-arrow-return-left text-amber-500 text-5xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Easy Returns</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            If for any reason, you are not completely satisfied with your purchase, you may return it up to 15 days from the original purchase date.
                        </p>
                    </div>

                    {/* 24/7 Support */}
                    <div className="rounded-lg p-8 border border-gray-400 bg-gray-200 text-center hover:border-amber-500 transition-all hover:transform hover:scale-105">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bi bi-headset text-amber-500 text-5xl"></i>
                        </div>
                        <h3 className=" font-bold text-xl mb-3">24/7 Support</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            If you have any further questions, please don't hesitate to contact us. Our team is always ready to help you.
                        </p>
                    </div>
                </div>

            </div>

            {/* Map Section */}
            <div className="w-full h-64 relative overflow-hidden">
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

            {/* WhatsApp Floating Button */}
            {/* <a
                href="https://wa.me/923430217146"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-50"
            >
                <i className="bi bi-whatsapp text-3xl"></i>
            </a> */}
        </div>
        </PageWrapper>
    );
}