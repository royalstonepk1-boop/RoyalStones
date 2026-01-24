import React from 'react'
import PageWrapper from '../util/PageWrapper'

const Terms = () => {
  return (
    <PageWrapper>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Royal Stones</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Royal Stones' website and services, you agree to be bound by these Terms and Conditions. 
              Please read them carefully before making any purchase.
            </p>
          </section>

          {/* General Terms */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Terms</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-2xl text-amber-600"></i>
                <span>All information provided must be accurate and truthful</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-2xl text-amber-600"></i>
                <span>You are responsible for maintaining account confidentiality</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-2xl text-amber-600"></i>
                <span>Prices are in Pakistani Rupees (PKR) and subject to change</span>
              </li>
            </ul>
          </section>

          {/* Product Information */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Authenticity Guarantee:</strong> All gemstones sold by Royal Stones are natural and authentic.
              </p>
              <p>
                <strong>Product Descriptions:</strong> We strive to provide accurate descriptions and images. However, 
                natural gemstones may have slight variations in color, clarity, and appearance.
              </p>
              <p>
                <strong>Availability:</strong> Products are subject to availability. We reserve the right to limit 
                quantities or discontinue products.
              </p>
            </div>
          </section>

          {/* Ordering & Payment */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ordering & Payment</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Confirmation</h3>
                <p className="text-gray-700 text-sm">
                  Your order is confirmed once you receive a confirmation email from us. We reserve the right to 
                  refuse or cancel orders at our discretion.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                <ul className="text-gray-700 text-sm space-y-1 ml-4">
                  <li>• Cash on Delivery (COD)</li>
                  <li>• Bank Transfer</li>
                  <li>• Online Payment (through secure gateways)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Security</h3>
                <p className="text-gray-700 text-sm">
                  All online payments are processed through secure, encrypted channels. We do not store your 
                  credit card information.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping & Delivery */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping & Delivery</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Delivery timeframes are estimates and not guaranteed</li>
              <li>• We are not responsible for delays caused by courier services or customs</li>
              <li>• You must inspect packages upon delivery</li>
              <li>• Risk of loss passes to you upon delivery</li>
              <li>• Additional charges may apply for remote areas</li>
            </ul>
          </section>

          {/* Returns & Refunds */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns & Refunds</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">15-Day Return Policy</h3>
                <p className="mb-2">You may return products within 15 days if:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Product is in original, unused condition</li>
                  <li>• You provide proof of purchase</li>
                  <li>• Return shipping is arranged at your cost</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Non-Returnable Items</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Custom-made or specially ordered gemstones</li>
                  <li>• Items damaged due to misuse or negligence</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Refund Process</p>
                <p className="text-sm">
                  Refunds are processed within 7-10 business days after receiving and inspecting the returned item. 
                  Refunds are issued to the original payment method.
                </p>
              </div>
            </div>
          </section>

          {/* Liability Limitation */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-3">
              Royal Stones shall not be liable for:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Indirect, consequential, or incidental damages</li>
              <li>• Loss of profits or business opportunities</li>
              <li>• Delays or failures due to circumstances beyond our control</li>
              <li>• Misuse or improper care of purchased gemstones</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700">
              All content on this website, including images, text, logos, and designs, is the property of Royal Stones 
              and protected by copyright laws. You may not reproduce, distribute, or use any content without our 
              written permission.
            </p>
          </section>

          {/* Governing Law */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700">
              These Terms and Conditions are governed by the laws of Pakistan. Any disputes will be subject to the 
              exclusive jurisdiction of the courts in Islamabad, Pakistan.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
              immediately upon posting. Your continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-8 bg-amber-50 rounded-lg p-6 -m-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 mb-3">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> royalstonepk1@gmail.com</p>
              <p><strong>Phone:</strong> +92-315-5066472</p>
              <p><strong>WhatsApp:</strong> +92-315-5066472</p>
            </div>
          </section>
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}

export default Terms