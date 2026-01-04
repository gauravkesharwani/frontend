import { ChatState, ChatContext, ChatMessage } from '@/types/lead'

export class ChatStateManager {
  private context: ChatContext

  constructor() {
    this.context = {
      state: 'greeting',
      answers: {},
      messages: [],
    }
  }

  getContext(): ChatContext {
    return this.context
  }

  addMessage(role: 'assistant' | 'user', content: string): void {
    const message: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date(),
    }
    this.context.messages.push(message)
  }

  updateAnswer(key: keyof ChatContext['answers'], value: any): void {
    this.context.answers[key] = value
  }

  updatePhoneNumber(phoneNumber: string): void {
    this.context.phoneNumber = phoneNumber
  }

  updateConsent(consent: boolean): void {
    this.context.consent = consent
  }

  transitionTo(newState: ChatState): void {
    this.context.state = newState
  }

  reset(): void {
    this.context = {
      state: 'greeting',
      answers: {},
      messages: [],
    }
  }

  getGreetingMessage(): string {
    return "Hi! I'm Alti, your real estate investment assistant. I'll help you discover investment opportunities that match your goals. This will only take a minute. Ready to get started?"
  }

  getQuestionMessage(state: ChatState): string {
    switch (state) {
      case 'question_1':
        return "Great! Let's start with your investment timeline. When are you looking to invest in real estate?"
      case 'question_2':
        return "Perfect! How much capital do you have available for your initial real estate investment?"
      case 'question_3':
        return "Excellent! What type of real estate investments interest you most? (You can select multiple)"
      case 'consent_gate':
        return "Thanks for sharing! To provide you with personalized investment opportunities, I need your consent to contact you. By continuing, you agree to receive calls and texts about real estate investments. Standard rates may apply."
      case 'phone_capture':
        return "Almost done! What's the best phone number to reach you?"
      default:
        return ""
    }
  }

  getNextState(currentState: ChatState): ChatState {
    const stateFlow: Record<ChatState, ChatState> = {
      greeting: 'question_1',
      question_1: 'question_2',
      question_2: 'question_3',
      question_3: 'consent_gate',
      consent_gate: 'phone_capture',
      phone_capture: 'submitting',
      submitting: 'submitted',
      submitted: 'submitted',
      error: 'error',
    }
    return stateFlow[currentState]
  }

  canProceed(): boolean {
    const { state, answers, consent, phoneNumber } = this.context

    switch (state) {
      case 'greeting':
        return true
      case 'question_1':
        return !!answers.investmentTimeline
      case 'question_2':
        return !!answers.capitalAvailable
      case 'question_3':
        return !!answers.investmentPreferences && answers.investmentPreferences.length > 0
      case 'consent_gate':
        return !!consent
      case 'phone_capture':
        return !!phoneNumber
      default:
        return false
    }
  }
}
