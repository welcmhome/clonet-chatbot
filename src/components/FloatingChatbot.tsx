'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function FloatingChatbot() {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  // Only scroll when messages change and there are messages
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100)
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
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

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${errorMessage}`,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Single Chat Container */}
      <div
        className="w-full max-w-[750px] mx-2 md:mx-0 rounded-3xl border border-[#35353b] shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(24,24,28,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 12px 48px 0 rgba(0,0,0,0.55)',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#35353b transparent',
            maxHeight: 'calc(70vh - 120px)',
          }}
        >
          <style jsx>{`
            .chat-container::-webkit-scrollbar {
              width: 6px;
            }
            .chat-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .chat-container::-webkit-scrollbar-thumb {
              background: #35353b;
              border-radius: 3px;
            }
            .chat-container::-webkit-scrollbar-thumb:hover {
              background: #45454b;
            }
          `}</style>
          <div className="space-y-4 chat-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] text-sm leading-relaxed ${
                    message.role === 'user' ? 'text-blue-400' : 'text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Form - Fixed at bottom */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-6 py-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="What do you want to know about Clonet?"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg px-0 py-0 h-[48px]"
            disabled={isSending}
            autoFocus
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className={`ml-4 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
              ${inputValue.trim() && !isSending ? 'bg-gradient-to-br from-[#35353b] to-[#23232b] hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-[#23232b]'}
              ${isSending ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            aria-label="Send"
            style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M12 5l6 6M12 5l-6 6" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  )
} 