'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface LeadData {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export default function FloatingChatbot() {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [leadData, setLeadData] = useState<LeadData>({})
  const [isCollectingLead, setIsCollectingLead] = useState(false)
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false)
  const [leadStep, setLeadStep] = useState(0)
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

  // Check if message triggers lead collection
  const checkLeadTrigger = (message: string): boolean => {
    const triggers = [
      'i want a quote',
      'how do i contact you',
      'can i speak to someone',
      'i need help with a project',
      'i need help',
      'do you do',
      'i want to work with you',
      'can you help me with',
      'i need a solution for',
      'contact you',
      'get a quote',
      'speak to someone',
      'work with you'
    ]
    
    const lowerMessage = message.toLowerCase()
    return triggers.some(trigger => lowerMessage.includes(trigger))
  }

  // Check if user agrees to submit form
  const checkUserAgreement = (message: string): boolean => {
    const affirmative = [
      'yes',
      'yeah',
      'sure',
      'okay',
      'ok',
      'yep',
      'absolutely',
      'definitely',
      'of course',
      'that sounds good',
      'sounds good',
      'let\'s do that',
      'do that',
      'submit',
      'submit request',
      'help me submit'
    ]
    
    const lowerMessage = message.toLowerCase()
    return affirmative.some(agree => lowerMessage.includes(agree))
  }

  // Handle lead collection step
  const handleLeadStep = async (userInput: string) => {
    const currentStep = leadStep
    let nextStep = currentStep + 1
    let response = ''

    switch (currentStep) {
      case 0: // STAGE 1: Full name
        setLeadData(prev => ({ ...prev, name: userInput }))
        response = "What's your email address?"
        break
      case 1: // STAGE 2: Email
        setLeadData(prev => ({ ...prev, email: userInput }))
        response = "What's your phone number? (optional — you can skip this if you prefer)"
        break
      case 2: // STAGE 3: Phone (optional)
        if (userInput.toLowerCase().includes('skip') || userInput.toLowerCase().includes('no') || userInput.trim() === '') {
          response = "What do you need help with?"
        } else {
          setLeadData(prev => ({ ...prev, phone: userInput }))
          response = "What do you need help with?"
        }
        break
      case 3: // STAGE 4: Message/Project description
        const finalLeadData = { ...leadData, message: userInput }
        
        // Submit lead data
        try {
          const submitResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Submit lead',
              leadData: finalLeadData
            }),
          })

          if (!submitResponse.ok) {
            throw new Error(`HTTP ${submitResponse.status}`)
          }

          const submitData = await submitResponse.json()
          response = submitData.response || "Thanks! I've sent your message to the team — someone will follow up with you shortly."
          
          // Reset lead collection state
          setIsCollectingLead(false)
          setLeadStep(0)
          setLeadData({})
        } catch (error) {
          console.error('Lead submission error:', error)
          response = "I had trouble submitting your request. You can email us directly at info@clonet.ai and we'll get back to you right away."
          setIsCollectingLead(false)
          setLeadStep(0)
          setLeadData({})
        }
        break
    }

    setLeadStep(nextStep)
    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputValue.trim()
    setInputValue('')
    setIsSending(true)

    try {
      // Check if we're in lead collection mode
      if (isCollectingLead) {
        const leadResponse = await handleLeadStep(userInput)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: leadResponse,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else if (isWaitingForConfirmation) {
        // Check if user agrees to submit form
        if (checkUserAgreement(userInput)) {
          setIsWaitingForConfirmation(false)
          setIsCollectingLead(true)
          setLeadStep(0)
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Great! Let's get your information. What's your full name?",
          }
          setMessages(prev => [...prev, assistantMessage])
        } else {
          // User declined, reset and continue normal chat
          setIsWaitingForConfirmation(false)
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "No problem! Feel free to email us at info@clonet.ai anytime. How else can I help you?",
          }
          setMessages(prev => [...prev, assistantMessage])
        }
      } else {
        // Check if this message triggers lead collection
        if (checkLeadTrigger(userInput)) {
          setIsWaitingForConfirmation(true)
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "You can email us at info@clonet.ai — or I can help you submit a request right here. Want to do that?",
          }
          setMessages(prev => [...prev, assistantMessage])
        } else {
          // Normal chat flow
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
        }
      }
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
      className="chatbot-overlay"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 48,
        zIndex: 2147483647,
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
          position: 'relative',
          background: 'rgba(24,24,28,1)',
          boxShadow: '0 12px 48px 0 rgba(0,0,0,0.55)',
          maxHeight: '50vh',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#35353b transparent',
            maxHeight: 'calc(50vh - 120px)',
          }}
        >
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #35353b;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #45454b;
            }
            @media (max-width: 768px) {
              .custom-scrollbar {
                max-height: calc(70vh - 120px) !important;
              }
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
          className="flex items-center px-6 py-4 relative"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={
            isCollectingLead 
              ? "Type your response..." 
              : isWaitingForConfirmation 
                ? "Yes or no..." 
                : "Got a Clonet question? Ask Dot!"
          }
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-base px-0 py-0 h-[48px]"
          disabled={isSending}
          autoFocus
          style={{ minWidth: 0 }}
        />
        <button
          type="submit"
            disabled={!inputValue.trim() || isSending}
            className={`absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200
              ${!inputValue.trim() || isSending
                ? 'bg-white/20 cursor-default'
                : 'bg-white hover:bg-neutral-200 cursor-pointer'
              }
          `}
          aria-label="Send"
          style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}
        >
          {isSending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: '#1A1A1A' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: '#1A1A1A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M12 5l6 6M12 5l-6 6" />
            </svg>
          )}
        </button>
      </form>
      </div>
    </div>
  )
} 