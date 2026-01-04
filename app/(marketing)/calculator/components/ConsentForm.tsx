'use client'

import { useState } from 'react'

interface ConsentFormProps {
  onConsent: (consent: boolean) => void
}

export default function ConsentForm({ onConsent }: ConsentFormProps) {
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = () => {
    if (agreed) {
      onConsent(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">TCPA Consent Required</p>
            <p>
              By providing your phone number and clicking "I Agree", you consent to receive calls and text messages
              from Alti and our partners about real estate investment opportunities. You understand that consent
              is not required to purchase any goods or services. Message and data rates may apply. You can opt out
              at any time by replying STOP to any text message.
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-start space-x-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          I agree to receive calls and text messages about real estate investment opportunities.
          I have read and agree to the <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>.
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!agreed}
        className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        I Agree - Continue
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your information is secure and will never be shared without your permission.
      </p>
    </div>
  )
}
