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
    return "Hi! I'm BlackKeyX, your real estate investment assistant. I'll help you discover investment opportunities that match your goals. This will only take a minute. Ready to get started?"
  }

  getQuestionMessage(state: ChatState): string {
    switch (state) {
      case 'investor_type':
        return "Are you investing personally as an individual, or through a family office or institution?"
      case 'capacity':
        return "What's a typical check size when you invest in a new real estate manager?"
      case 'fit':
        return "Where does US industrial real estate sit in your current allocation priorities?"
      case 'process':
        return "How do you typically start new manager relationships?"
      case 'timing':
        return "Are you actively looking to place capital in the next 3-6 months?"
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
      greeting: 'investor_type',
      investor_type: 'capacity',
      capacity: 'fit',
      fit: 'process',
      process: 'timing',
      timing: 'consent_gate',
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
      case 'investor_type':
        return !!answers.investorType
      case 'capacity':
        return !!answers.capacity
      case 'fit':
        return !!answers.fit
      case 'process':
        return !!answers.process
      case 'timing':
        return !!answers.timing
      case 'consent_gate':
        return !!consent
      case 'phone_capture':
        return !!phoneNumber
      default:
        return false
    }
  }
}
