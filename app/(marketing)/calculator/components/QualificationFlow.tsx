'use client'

import { useState } from 'react'
import { ChatState } from '@/types/lead'
import { cn } from '@/lib/utils'

interface QualificationFlowProps {
  state: ChatState
  onAnswer: (answer: string | string[]) => void
}

const timelineOptions = [
  { value: 'immediate', label: 'Ready Now', description: 'Looking to invest within 1-3 months' },
  { value: '3-6months', label: '3-6 Months', description: 'Planning to invest this year' },
  { value: '6-12months', label: '6-12 Months', description: 'Building capital for investment' },
  { value: '12+months', label: '1+ Years', description: 'Long-term planning phase' },
]

const capitalOptions = [
  { value: '50k-100k', label: '$50K - $100K', description: 'Entry-level investment' },
  { value: '100k-250k', label: '$100K - $250K', description: 'Standard investment range' },
  { value: '250k-500k', label: '$250K - $500K', description: 'Substantial investment' },
  { value: '500k+', label: '$500K+', description: 'Premium investment tier' },
]

const preferenceOptions = [
  { value: 'residential', label: 'Residential', description: 'Single/multi-family homes', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', description: 'Office & retail spaces', icon: '🏢' },
  { value: 'industrial', label: 'Industrial', description: 'Warehouses & manufacturing', icon: '🏭' },
  { value: 'mixed-use', label: 'Mixed-Use', description: 'Combined residential/commercial', icon: '🌆' },
  { value: 'land', label: 'Land Development', description: 'Raw land & development', icon: '🌄' },
  { value: 'reit', label: 'REITs', description: 'Real estate investment trusts', icon: '📈' },
]

export default function QualificationFlow({ state, onAnswer }: QualificationFlowProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  const handleSingleSelect = (value: string) => {
    onAnswer(value)
  }

  const handleMultiSelect = (value: string) => {
    const newPreferences = selectedPreferences.includes(value)
      ? selectedPreferences.filter(p => p !== value)
      : [...selectedPreferences, value]
    setSelectedPreferences(newPreferences)
  }

  const handlePreferencesSubmit = () => {
    if (selectedPreferences.length > 0) {
      onAnswer(selectedPreferences)
    }
  }

  if (state === 'question_1') {
    return (
      <div className="space-y-3">
        {timelineOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSingleSelect(option.value)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-primary-600">{option.label}</div>
            <div className="text-sm text-gray-600">{option.description}</div>
          </button>
        ))}
      </div>
    )
  }

  if (state === 'question_2') {
    return (
      <div className="space-y-3">
        {capitalOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSingleSelect(option.value)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="font-semibold text-lg text-gray-900 group-hover:text-primary-600">{option.label}</div>
            <div className="text-sm text-gray-600">{option.description}</div>
          </button>
        ))}
      </div>
    )
  }

  if (state === 'question_3') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {preferenceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMultiSelect(option.value)}
              className={cn(
                'p-4 border-2 rounded-xl transition-all text-left',
                selectedPreferences.includes(option.value)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              )}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </div>
                {selectedPreferences.includes(option.value) && (
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handlePreferencesSubmit}
          disabled={selectedPreferences.length === 0}
          className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue ({selectedPreferences.length} selected)
        </button>
      </div>
    )
  }

  return null
}
