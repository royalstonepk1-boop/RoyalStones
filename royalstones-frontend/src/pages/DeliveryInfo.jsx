import React from 'react'
import PageWrapper from '../util/PageWrapper'

const DeliveryInfo = () => {
  return (
    <PageWrapper>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Delivery Information
          </h1>
          <p className="text-gray-600">
            Learn about our delivery process and packaging standards
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Premium Packaging */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <i className="bi bi-box-seam text-amber-600 text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Packaging</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  At Royal Stones, we understand that gemstones are precious and delicate. Each gemstone is carefully packaged with multiple layers of protection:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span><strong>Individual Pouches:</strong> Each gemstone is placed in a soft velvet or silk pouch to prevent scratches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span><strong>Protective Box:</strong> Stones are secured in a cushioned jewelry box with foam padding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span><strong>Bubble Wrap:</strong> Additional bubble wrap protection for safe transit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span><strong>Tamper-Proof Seal:</strong> All packages are sealed with security tape</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div className="mb-8 border-t pt-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <i className="bi bi-truck text-blue-600 text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Delivery Process</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Order Processing</h3>
                    <p>Orders are processed within 1-2 business days.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Delivery Timeframe</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Major Cities:</strong> 2-4 business days</li>
                      <li>• <strong>Other Areas:</strong> 4-7 business days</li>
                      <li>• <strong>Remote Areas:</strong> 7-10 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="mb-8 border-t pt-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <i className="bi bi-currency-dollar text-green-600 text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Shipping Charges</h2>
                <p className="text-gray-700 mb-3">
                  We offer comfortable and affordable shipping rates across Pakistan:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-gray-700"><strong>Standard Delivery:</strong> Rs 300 - Rs 550 (depending on location)</p>
                  <p className="text-gray-700 mt-2"><strong>Cash on Delivery:</strong> Available nationwide</p>
                  <p className="text-green-700 mt-2 font-semibold">
                    <i className="bi bi-gift mr-2"></i>
                    Free shipping on orders above Rs 10,000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance & Safety */}
          <div className="border-t pt-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <i className="bi bi-shield-check text-purple-600 text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Insurance & Safety</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span>Full insurance coverage on all shipments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span>100% refund or replacement guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                    <span>Dedicated customer support for delivery issues</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        {/* <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Questions About Delivery?</h3>
          <p className="mb-4">Our team is here to help you with any shipping concerns</p>
          <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Support
          </button>
        </div> */}
      </div>
    </div>
    </PageWrapper>

  )
}

export default DeliveryInfo