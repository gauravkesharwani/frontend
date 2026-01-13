'use client'

import { useState, useEffect } from 'react'
import { ChatStateManager } from '@/lib/state-manager'
import { ChatState, InvestorType, CapacityLevel, FitLevel, ProcessStyle, TimingLevel } from '@/types/lead'
import { buildQualification } from '@/lib/qualification-scoring'
import ChatInterface from './components/ChatInterface'
import QualificationFlow from './components/QualificationFlow'
import ConsentForm from './components/ConsentForm'
import PhoneInput from './components/PhoneInput'

export default function CalculatorPage() {
  const [stateManager] = useState(() => new ChatStateManager())
  const [currentState, setCurrentState] = useState<ChatState>('greeting')
  const [isLoading, setIsLoading] = useState(false)
  const [showInteractive, setShowInteractive] = useState(false)

  useEffect(() => {
    // Initial greeting
    stateManager.addMessage('assistant', stateManager.getGreetingMessage())
    setCurrentState('greeting')
    setShowInteractive(true)
  }, [])

  const handleStart = () => {
    stateManager.addMessage('user', "Yes, let's get started!")
    setIsLoading(true)

    setTimeout(() => {
      const nextState = stateManager.getNextState('greeting')
      stateManager.transitionTo(nextState)
      stateManager.addMessage('assistant', stateManager.getQuestionMessage(nextState))
      setCurrentState(nextState)
      setShowInteractive(true)
      setIsLoading(false)
    }, 500)
  }

  const handleAnswer = (answer: string) => {
    // Handle "other:" prefix for custom answers
    const isOther = answer.startsWith('other:')
    const displayValue = isOther ? answer.substring(6) : (answerLabels[answer] || answer)
    stateManager.addMessage('user', displayValue)

    // Store the answer - for "other" responses, we keep the "other:" prefix
    if (currentState === 'investor_type') {
      stateManager.updateAnswer('investorType', answer as InvestorType)
    } else if (currentState === 'capacity') {
      stateManager.updateAnswer('capacity', answer as CapacityLevel)
    } else if (currentState === 'fit') {
      stateManager.updateAnswer('fit', answer as FitLevel)
    } else if (currentState === 'process') {
      stateManager.updateAnswer('process', answer as ProcessStyle)
    } else if (currentState === 'timing') {
      stateManager.updateAnswer('timing', answer as TimingLevel)
    }

    setIsLoading(true)
    setShowInteractive(false)

    setTimeout(() => {
      const nextState = stateManager.getNextState(currentState)
      stateManager.transitionTo(nextState)
      stateManager.addMessage('assistant', stateManager.getQuestionMessage(nextState))
      setCurrentState(nextState)
      setShowInteractive(true)
      setIsLoading(false)
    }, 800)
  }

  const handleConsent = (consent: boolean) => {
    stateManager.updateConsent(consent)
    stateManager.addMessage('user', 'I agree to be contacted')
    setIsLoading(true)
    setShowInteractive(false)

    setTimeout(() => {
      const nextState = stateManager.getNextState(currentState)
      stateManager.transitionTo(nextState)
      stateManager.addMessage('assistant', stateManager.getQuestionMessage(nextState))
      setCurrentState(nextState)
      setShowInteractive(true)
      setIsLoading(false)
    }, 500)
  }

  const handlePhoneSubmit = async (phoneNumber: string) => {
    stateManager.updatePhoneNumber(phoneNumber)
    stateManager.addMessage('user', phoneNumber)
    setIsLoading(true)
    setShowInteractive(false)

    // Prepare lead data with qualification
    const context = stateManager.getContext()
    const qualification = buildQualification(context.answers)

    const leadData = {
      phoneNumber: phoneNumber,
      consent: context.consent || false,
      timestamp: new Date().toISOString(),
      qualification: qualification,
    }

    try {
      // Submit to API
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        stateManager.transitionTo('submitted')
        stateManager.addMessage('assistant',
          "Perfect! Thank you for sharing your information. 🎉\n\n" +
          "I've found several investment opportunities that match your profile. " +
          "One of our investment specialists will contact you within 24 hours to discuss these opportunities.\n\n" +
          "In the meantime, you can expect:\n" +
          "✓ A personalized investment portfolio\n" +
          "✓ Market analysis for your selected preferences\n" +
          "✓ Expert guidance from our team\n\n" +
          "We're excited to help you achieve your real estate investment goals!"
        )
        setCurrentState('submitted')
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Failed to submit lead:', error)
      stateManager.transitionTo('error')
      stateManager.addMessage('assistant',
        "I apologize, but there was an issue submitting your information. " +
        "Please try again or contact us directly at (555) 123-4567."
      )
      setCurrentState('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="section-container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect <span className="text-primary-500">Investment</span>
            </h1>
            <p className="text-xl text-gray-600">
              Answer a few quick questions to get personalized real estate opportunities
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ChatInterface
                  stateManager={stateManager}
                  isLoading={isLoading}
                  shouldScroll={showInteractive}
                />
              </div>

              {/* Interactive Components */}
              {showInteractive && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {currentState === 'greeting' && (
                    <button
                      onClick={handleStart}
                      className="w-full btn-primary"
                    >
                      Yes, Let's Get Started!
                    </button>
                  )}

                  {['investor_type', 'capacity', 'fit', 'process', 'timing'].includes(currentState) && (
                    <QualificationFlow
                      state={currentState}
                      onAnswer={handleAnswer}
                    />
                  )}

                  {currentState === 'consent_gate' && (
                    <ConsentForm onConsent={handleConsent} />
                  )}

                  {currentState === 'phone_capture' && (
                    <PhoneInput onSubmit={handlePhoneSubmit} />
                  )}

                  {currentState === 'submitted' && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">You're All Set!</h3>
                      <p className="text-gray-600 mb-4">We'll be in touch soon with your personalized investment opportunities.</p>
                      <a href="/" className="btn-primary inline-block">
                        Return to Home
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-sm font-semibold text-gray-900">Secure & Private</div>
              <div className="text-xs text-gray-600">Your data is encrypted</div>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm font-semibold text-gray-900">2 Minutes</div>
              <div className="text-xs text-gray-600">Quick & easy process</div>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm font-semibold text-gray-900">No Commitment</div>
              <div className="text-xs text-gray-600">Just exploring options</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Label mappings for displaying user-friendly text
const answerLabels: Record<string, string> = {
  // Investor type
  'hnw': 'Individual investor',
  'family_office': 'Family Office / Institution',
  // Capacity
  '$100K-$250K': '$100K - $250K',
  '$250K-$500K': '$250K - $500K',
  '$500K-$1M': '$500K - $1M',
  '$1M+': '$1M+',
  // Fit
  'high_priority': 'High priority',
  'medium_priority': 'Medium priority',
  'open_to_exploring': 'Open to exploring',
  'not_a_focus': 'Not a current focus',
  // Process
  'toe_in': 'Small toe-in first',
  'meaningful_first': 'Meaningful first allocation',
  'full_commitment': 'Full commitment if convinced',
  // Timing
  'actively_deploying': 'Yes, actively deploying',
  'possibly_evaluating': 'Possibly, evaluating options',
  'just_researching': 'No, just researching',
}
