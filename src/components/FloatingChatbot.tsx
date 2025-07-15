'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function FloatingChatbot() {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 48,
        zIndex: 9999,
        transform: 'translateX(-50%)',
        width: '100%',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {isOpen && (
        <div
          className="w-full max-w-[750px] mx-2 md:mx-0 mb-4 rounded-3xl border border-[#35353b] shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(24,24,28,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            pointerEvents: 'auto',
            boxShadow: '0 12px 48px 0 rgba(0,0,0,0.55)',
            maxHeight: '60vh',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#35353b]">
            <h3 className="text-white font-semibold">Clonet Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[40vh]">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>Start a conversation with Clonet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#35353b] text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-[#35353b] text-white rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[750px] mx-2 md:mx-0 flex items-center px-10 py-7 rounded-3xl border border-[#35353b] shadow-2xl"
        style={{
          background: 'rgba(24,24,28,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          pointerEvents: 'auto',
          boxShadow: '0 12px 48px 0 rgba(0,0,0,0.55)',
        }}
      >
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={isOpen ? "Type your message..." : "What do you want to know about Clonet?"}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-xl px-0 py-0 h-[60px] md:h-[68px]"
          disabled={isSending}
          autoFocus
          style={{ minWidth: 0 }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className={`ml-4 w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200
            ${inputValue.trim() && !isSending ? 'bg-gradient-to-br from-[#35353b] to-[#23232b] hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-[#23232b]'}
            ${isSending ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          aria-label="Send"
          style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}
        >
          {isSending ? (
            <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M12 5l6 6M12 5l-6 6" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
} 