'use client'

import { useState } from 'react'
import { formatPhoneNumber, validatePhone } from '@/lib/validation'

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void
}

export default function PhoneInput({ onSubmit }: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneNumber(value)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = phoneNumber.replace(/\D/g, '')

    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    if (!validatePhone(cleanPhone)) {
      setError('Please enter a valid phone number')
      return
    }

    onSubmit(formatPhoneNumber(cleanPhone))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          autoComplete="tel"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-gray-600">
            Your phone number is kept secure and will only be used to discuss your real estate investment opportunities.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full btn-primary"
      >
        Submit & Get My Investment Matches
      </button>
    </form>
  )
}
