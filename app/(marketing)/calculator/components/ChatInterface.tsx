'use client'

import { useEffect, useRef } from 'react'
import { ChatStateManager } from '@/lib/state-manager'
import { ChatMessage } from '@/types/lead'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  stateManager: ChatStateManager
  isLoading?: boolean
  shouldScroll?: boolean
}

export default function ChatInterface({ stateManager, isLoading, shouldScroll }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const context = stateManager.getContext()

  const scrollToBottom = () => {
    // Use double requestAnimationFrame to ensure layout is fully calculated after options panel renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [context.messages])

  // Scroll when interactive options appear (shouldScroll becomes true)
  useEffect(() => {
    if (shouldScroll) {
      scrollToBottom()
    }
  }, [shouldScroll])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {context.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={cn(
      'flex items-start space-x-3',
      !isAssistant && 'flex-row-reverse space-x-reverse'
    )}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
      )}
      <div className={cn(
        'max-w-[70%] rounded-2xl px-4 py-3',
        isAssistant ? 'bg-gray-100 text-gray-900 rounded-tl-sm' : 'bg-primary-500 text-white rounded-tr-sm'
      )}>
        <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
