'use client'

import { useState, useRef } from 'react'

export default function FloatingChatbot() {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setInputValue('')
        inputRef.current?.focus()
      }, 1200)
    }, 800)
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[900px] mx-2 md:mx-0 flex items-center px-10 py-8 rounded-3xl border border-[#35353b] shadow-2xl"
        style={{
          background: 'rgba(24,24,28,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          pointerEvents: 'auto',
          boxShadow: '0 12px 48px 0 rgba(0,0,0,0.55)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="What do you want to know about Clonet?"
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-xl px-0 py-0 h-16 md:h-20"
          disabled={isSending || sent}
          autoFocus
          style={{ minWidth: 0 }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending || sent}
          className={`ml-4 w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200
            ${inputValue.trim() && !isSending && !sent ? 'bg-gradient-to-br from-[#35353b] to-[#23232b] hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-[#23232b]'}
            ${isSending || sent ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          aria-label="Send"
          style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}
        >
          {isSending ? (
            <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : sent ? (
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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