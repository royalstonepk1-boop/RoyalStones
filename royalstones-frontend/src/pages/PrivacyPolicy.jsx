import React from 'react'
import PageWrapper from '../util/PageWrapper'

const PrivacyPolicy = () => {
  return (
    <PageWrapper>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="bi bi-shield-lock text-amber-600"></i>
              Your Privacy Matters
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Royal Stones, we are committed to protecting your privacy and securing your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Personal Information</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Full name and contact details</li>
                  <li>• Email address and phone number</li>
                  <li>• Shipping and billing addresses</li>
                  <li>• Payment information (processed securely through third-party payment gateways)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Automatic Information</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• IP address and browser type</li>
                  <li>• Device information and operating system</li>
                  <li>• Pages visited and time spent on our website</li>
                  <li>• Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                <span><strong>Order Processing:</strong> To process and fulfill your gemstone orders</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                <span><strong>Communication:</strong> To send order confirmations, shipping updates, and customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                <span><strong>Personalization:</strong> To improve your shopping experience and provide relevant recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-green-500 mt-1"></i>
                <span><strong>Security:</strong> To prevent fraud and ensure secure transactions</span>
              </li>
            </ul>
          </section>

          {/* Third-Party Sharing */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Sharing</h2>
            <p className="text-gray-700 mb-3">
              We do not sell or rent your personal information. We may share data with:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• <strong>Shipping Partners:</strong> To deliver your orders</li>
              <li>• <strong>Payment Processors:</strong> To complete transactions securely</li>
              <li>• <strong>Service Providers:</strong> For website hosting and analytics</li>
              <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Access and review your personal information</li>
              <li>• Request corrections to your data</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t pt-8 bg-amber-50 rounded-lg p-6 -m-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-3">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> royalstonepk1@gmail.com</p>
              <p><strong>Phone:</strong> +92-315-5066472</p>
              <p><strong>Address:</strong> Rizwan Shaheed Rd, Nai Abadi Barakahu, Kot Hathyal, Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}

export default PrivacyPolicy