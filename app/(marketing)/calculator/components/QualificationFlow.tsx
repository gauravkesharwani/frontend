'use client'

import { useState } from 'react'
import { ChatState, InvestorType, CapacityLevel, FitLevel, ProcessStyle, TimingLevel } from '@/types/lead'

interface QualificationFlowProps {
  state: ChatState
  onAnswer: (answer: string) => void
}

interface Option<T extends string> {
  value: T | 'other'
  label: string
  description: string
}

const investorTypeOptions: Option<InvestorType>[] = [
  { value: 'hnw', label: 'Individual Investor', description: 'Investing personal capital' },
  { value: 'family_office', label: 'Family Office / Institution', description: 'Investing on behalf of a family office or institution' },
  { value: 'other', label: 'Other', description: 'Specify your investor type' },
]

const capacityOptions: Option<CapacityLevel>[] = [
  { value: '$100K-$250K', label: '$100K - $250K', description: 'Entry-level manager allocation' },
  { value: '$250K-$500K', label: '$250K - $500K', description: 'Standard allocation range' },
  { value: '$500K-$1M', label: '$500K - $1M', description: 'Substantial allocation' },
  { value: '$1M+', label: '$1M+', description: 'Premium tier allocation' },
  { value: 'other', label: 'Other', description: 'Specify your typical check size' },
]

const fitOptions: Option<FitLevel>[] = [
  { value: 'high_priority', label: 'High Priority', description: 'Actively seeking US industrial exposure' },
  { value: 'medium_priority', label: 'Medium Priority', description: 'One of several focus areas' },
  { value: 'open_to_exploring', label: 'Open to Exploring', description: 'Interested but not a current priority' },
  { value: 'not_a_focus', label: 'Not a Current Focus', description: 'Other sectors take precedence' },
  { value: 'other', label: 'Other', description: 'Specify your allocation priorities' },
]

const processOptions: Option<ProcessStyle>[] = [
  { value: 'toe_in', label: 'Small Toe-In First', description: 'Start with a smaller allocation to build confidence' },
  { value: 'meaningful_first', label: 'Meaningful First Allocation', description: 'Comfortable committing meaningfully from the start' },
  { value: 'full_commitment', label: 'Full Commitment If Convinced', description: 'Ready for a full allocation if the opportunity fits' },
  { value: 'other', label: 'Other', description: 'Specify your relationship approach' },
]

const timingOptions: Option<TimingLevel>[] = [
  { value: 'actively_deploying', label: 'Yes, Actively Deploying', description: 'Looking to place capital in the next 3-6 months' },
  { value: 'possibly_evaluating', label: 'Possibly, Evaluating Options', description: 'Open to opportunities but no immediate pressure' },
  { value: 'just_researching', label: 'No, Just Researching', description: 'Gathering information for future consideration' },
  { value: 'other', label: 'Other', description: 'Specify your timeline' },
]

function OptionButton<T extends string>({
  option,
  onClick,
  isSelected,
}: {
  option: Option<T>
  onClick: (value: T | 'other') => void
  isSelected: boolean
}) {
  return (
    <button
      onClick={() => onClick(option.value)}
      className={`w-full text-left p-4 border-2 rounded-xl transition-all group ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
      }`}
    >
      <div className={`font-semibold ${isSelected ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'}`}>
        {option.label}
      </div>
      <div className="text-sm text-gray-600">{option.description}</div>
    </button>
  )
}

function OtherInput({
  placeholder,
  onSubmit,
  onCancel,
}: {
  placeholder: string
  onSubmit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            handleSubmit()
          }
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default function QualificationFlow({ state, onAnswer }: QualificationFlowProps) {
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [selectedOther, setSelectedOther] = useState(false)

  const handleSelect = (value: string) => {
    if (value === 'other') {
      setSelectedOther(true)
      setShowOtherInput(true)
    } else {
      setSelectedOther(false)
      setShowOtherInput(false)
      onAnswer(value)
    }
  }

  const handleOtherSubmit = (customValue: string) => {
    onAnswer(`other:${customValue}`)
    setShowOtherInput(false)
    setSelectedOther(false)
  }

  const handleOtherCancel = () => {
    setShowOtherInput(false)
    setSelectedOther(false)
  }

  const renderOptions = <T extends string>(
    options: Option<T>[],
    placeholder: string
  ) => (
    <div className="space-y-3">
      {options.map((option) => (
        <OptionButton
          key={option.value}
          option={option}
          onClick={handleSelect}
          isSelected={selectedOther && option.value === 'other'}
        />
      ))}
      {showOtherInput && (
        <OtherInput
          placeholder={placeholder}
          onSubmit={handleOtherSubmit}
          onCancel={handleOtherCancel}
        />
      )}
    </div>
  )

  if (state === 'investor_type') {
    return renderOptions(investorTypeOptions, 'e.g., RIA, Endowment, Pension Fund...')
  }

  if (state === 'capacity') {
    return renderOptions(capacityOptions, 'e.g., $50K, $2M, varies by opportunity...')
  }

  if (state === 'fit') {
    return renderOptions(fitOptions, 'e.g., Looking at multifamily instead...')
  }

  if (state === 'process') {
    return renderOptions(processOptions, 'e.g., Co-invest first, depends on deal size...')
  }

  if (state === 'timing') {
    return renderOptions(timingOptions, 'e.g., Within 12 months, after Q2...')
  }

  return null
}
