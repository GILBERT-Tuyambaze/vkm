'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { 
  X, 
  Send, 
  RotateCcw, 
  GripVertical,
  Maximize2,
  Minimize2,
  ExternalLink,
  MessageCircle
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Hello! I'm **Gilbert**, the VIKM GROUP AI assistant. How can I help you today with your construction, architecture, interior design, made-to-measure furniture, branding, or software project in Kigali?",
    timestamp: 'Just now'
  }
]

const quickSuggestions = [
  'What services do you offer?',
  'Show architectural price table',
  'What are software development rates?',
  'Can you build custom kitchens?',
  'Where are you located in Kigali?',
]

export function GilbertAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Visitor greeting popup & badge label transition
  const [showGreetingBubble, setShowGreetingBubble] = useState(false)
  const [badgeLabel, setBadgeLabel] = useState<'Gilbert AI' | 'Ask me'>('Gilbert AI')

  // Position state (defaults to bottom-left)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 24, y: 24 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ 
    startX: number; 
    startY: number; 
    posX: number; 
    posY: number; 
    hasMoved: boolean;
    startTime: number;
  }>({
    startX: 0,
    startY: 0,
    posX: 24,
    posY: 24,
    hasMoved: false,
    startTime: 0
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Initialize position to bottom left
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultY = Math.max(20, window.innerHeight - 80)
      setPos({ x: 24, y: defaultY })
    }
  }, [])

  // Pop-up greeting message on user visit, then fade out and switch label to 'Ask me'
  useEffect(() => {
    // 1. Pop up greeting message card after 1.6s
    const greetingTimer = setTimeout(() => {
      setShowGreetingBubble(true)
    }, 1600)

    // 2. Fade out greeting bubble after 7s and transition badge label to 'Ask me'
    const fadeTimer = setTimeout(() => {
      setShowGreetingBubble(false)
      setBadgeLabel('Ask me')
    }, 7500)

    return () => {
      clearTimeout(greetingTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [messages, isOpen, isExpanded])

  // Drag handlers for mouse & touch
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      posX: pos.x,
      posY: pos.y,
      hasMoved: false,
      startTime: Date.now()
    }
  }, [pos])

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    const deltaX = clientX - dragRef.current.startX
    const deltaY = clientY - dragRef.current.startY

    if (Math.hypot(deltaX, deltaY) > 6) {
      dragRef.current.hasMoved = true
    }

    const widgetWidth = isOpen ? (isExpanded ? 580 : 390) : 160
    const widgetHeight = isOpen ? (isExpanded ? 600 : 520) : 48

    const maxX = Math.max(16, window.innerWidth - widgetWidth - 16)
    const maxY = Math.max(16, window.innerHeight - widgetHeight - 16)

    const nextX = Math.min(Math.max(16, dragRef.current.posX + deltaX), maxX)
    const nextY = Math.min(Math.max(16, dragRef.current.posY + deltaY), maxY)

    setPos({ x: nextX, y: nextY })
  }, [isDragging, isOpen, isExpanded])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handleDragEnd()
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => handleDragEnd()

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onTouchMove)
      window.addEventListener('touchend', onTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await res.json()
      const botReply = data.reply || "I'm having trouble connecting right now. Please feel free to reach out directly via WhatsApp at +250 794 399 892!"

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: "You can reach the VIKM GROUP team directly on **[WhatsApp (+250 794 399 892)](https://wa.me/250794399892)** or submit an inquiry at **[/quote](/quote)**.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages(initialMessages)
    setInput('')
  }

  // Calculate opening position: Open UPWARD if the badge is in the lower portion of the screen
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const chatModalHeight = isExpanded ? 600 : 520
  const chatModalWidth = isExpanded ? Math.min(580, screenWidth - 32) : Math.min(390, screenWidth - 32)

  const computedModalTop = pos.y > screenHeight - chatModalHeight
    ? Math.max(16, pos.y - chatModalHeight + 48) // Opens upwards!
    : Math.max(16, Math.min(pos.y, screenHeight - chatModalHeight - 16))

  const computedModalLeft = Math.max(16, Math.min(pos.x, screenWidth - chatModalWidth - 16))

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: isOpen ? `${computedModalLeft}px` : `${pos.x}px`,
        top: isOpen ? `${computedModalTop}px` : `${pos.y}px`,
        zIndex: 9999,
        touchAction: 'none'
      }}
      className={`transition-shadow ${isDragging ? 'cursor-grabbing select-none opacity-90' : ''}`}
    >
      {/* 1. Minimized Movable Trigger Badge + Visitor Greeting Speech Bubble */}
      {!isOpen && (
        <div className="relative">
          {/* Pop-up Greeting Message Card (pops up on visit, fades out after timeout) */}
          {showGreetingBubble && (
            <div 
              onClick={(e) => {
                e.stopPropagation()
                setShowGreetingBubble(false)
                setIsOpen(true)
              }}
              className="absolute bottom-[calc(100%+14px)] left-0 z-30 flex cursor-pointer flex-col rounded-2xl border border-[var(--line)] bg-white/95 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300 min-w-[210px] max-w-[260px] select-none hover:border-[var(--timber)] transition-all hover:scale-[1.02]"
            >
              {/* Card Header with Brand & Close Button */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--line)]/50 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-[var(--ink)]">Gilbert AI</span>
                  <span className="text-[9px] text-[var(--stone)]">· VIKM Group</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowGreetingBubble(false)
                    setBadgeLabel('Ask me')
                  }}
                  title="Dismiss greeting"
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-black/5 text-[var(--stone)] hover:bg-black/10 hover:text-[var(--ink)] transition-colors"
                >
                  <X size={10} />
                </button>
              </div>

              {/* Message */}
              <p className="text-xs font-medium text-[var(--ink)] leading-snug">
                Hey there! Need any help? 👋
              </p>

              {/* Speech Bubble Arrow pointing down to launcher */}
              <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-r border-b border-[var(--line)] bg-white" />
            </div>
          )}

          {/* Launcher Pill */}
          <div 
            onMouseDown={e => {
              handleDragStart(e.clientX, e.clientY)
            }}
            onTouchStart={e => {
              if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
            }}
            onClick={() => {
              if (!dragRef.current.hasMoved) {
                setShowGreetingBubble(false)
                setIsOpen(true)
              }
            }}
            title="Click to chat · Drag anywhere"
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-[var(--ink)]/95 backdrop-blur-md px-2.5 py-1.5 text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-black hover:border-[var(--timber)] select-none"
          >
            {/* Subtle grip handle */}
            <div className="flex h-5 w-3.5 items-center justify-center text-white/40 group-hover:text-white/80">
              <GripVertical size={13} />
            </div>

            {/* Avatar with High-Visibility Pulsing Live Indicator ON TOP */}
            <div className="relative shrink-0">
              <div className="h-8 w-8 overflow-hidden rounded-full border border-[var(--timber)] bg-[var(--timber)] shadow-xs">
                <img
                  src="/images/gilbert.jpeg"
                  alt="Gilbert AI"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {/* Highly visible pulsating Live indicator on top-right */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-[var(--ink)] shadow-[0_0_8px_rgba(52,211,153,1)]" />
              </span>
            </div>

            {/* Dynamic Label (Transitions from 'Gilbert AI' to 'Ask me') */}
            <div className="flex items-center gap-1.5 pr-1">
              <span className="text-xs font-semibold tracking-tight text-white transition-all">
                {badgeLabel}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Open Movable Chat Window with Full Markdown, Tables, Math & Link Rendering */}
      {isOpen && (
        <div 
          style={{
            width: `${chatModalWidth}px`,
            height: `${chatModalHeight}px`
          }}
          className="flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[#fdfbf7] shadow-2xl animate-in fade-in duration-200 transition-all"
        >
          {/* Draggable Chat Header Bar */}
          <div
            onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
            onTouchStart={e => {
              if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
            }}
            className="flex cursor-grab active:cursor-grabbing items-center justify-between border-b border-[var(--line)] bg-[var(--ink)] px-4 py-3 text-white select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="h-8 w-8 overflow-hidden rounded-full border border-[var(--timber)] bg-[var(--timber)]">
                  <img
                    src="/images/gilbert.jpeg"
                    alt="Gilbert Tuyambaze"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[var(--ink)] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold tracking-wide">Gilbert AI</h3>
                  <span className="rounded-full bg-[var(--timber)]/25 px-1.5 py-0.2 text-[9px] font-semibold text-[var(--timber)]">
                    VIKM Assistant
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Drag anywhere
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
              {/* Expand / Minimize Width Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse to standard view" : "Expand to wide view for tables"}
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw size={14} />
              </button>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body with Full Markdown, Tables, LaTeX Math & Links */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="mt-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[var(--timber)] bg-[var(--timber)]">
                    <img
                      src="/images/gilbert.jpeg"
                      alt="Gilbert"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-br-xs bg-[var(--timber)] text-white'
                      : 'max-w-[92%] rounded-bl-xs border border-[var(--line)] bg-white text-[var(--graphite)] shadow-xs'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <div className="prose prose-xs max-w-none break-words text-[11.5px] leading-relaxed text-[var(--graphite)]">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          table: ({ children }) => (
                            <div className="my-2.5 w-full overflow-x-auto rounded-lg border border-[var(--line)] bg-white shadow-2xs">
                              <table className="w-full text-left text-[11px] border-collapse min-w-[280px]">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-[#f4efe6] text-[var(--ink)] font-semibold border-b border-[var(--line)]">
                              {children}
                            </thead>
                          ),
                          th: ({ children }) => (
                            <th className="px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wider text-[var(--ink)] border-r border-[var(--line)]/50 last:border-r-0 whitespace-nowrap">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-2.5 py-1.5 border-t border-[var(--line)]/60 border-r border-[var(--line)]/40 last:border-r-0 text-[11px] leading-relaxed text-[var(--graphite)]">
                              {children}
                            </td>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-[#fcfaf6] transition-colors odd:bg-white even:bg-[#faf7f2]/50">
                              {children}
                            </tr>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 space-y-1 my-1.5 text-[11.5px] text-[var(--graphite)]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 space-y-1 my-1.5 text-[11.5px] text-[var(--graphite)]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-sm font-bold text-[var(--ink)] mt-2.5 mb-1.5">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xs font-bold text-[var(--ink)] mt-2 mb-1">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xs font-semibold text-[var(--ink)] mt-1.5 mb-1">{children}</h3>
                          ),
                          a: ({ href, children }) => {
                            const isWhatsApp = href?.includes('wa.me') || href?.includes('whatsapp')
                            const isInternal = href?.startsWith('/')
                            
                            return (
                              <a
                                href={href}
                                target={href?.startsWith('http') ? '_blank' : '_self'}
                                rel="noreferrer"
                                className={`inline-flex items-center gap-1 font-semibold underline break-all transition-colors ${
                                  isWhatsApp 
                                    ? 'text-emerald-700 hover:text-emerald-800' 
                                    : 'text-[var(--timber)] hover:text-[var(--timber-dk)]'
                                }`}
                              >
                                {children}
                                {href?.startsWith('http') && <ExternalLink size={10} className="inline opacity-70" />}
                              </a>
                            )
                          },
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[var(--ink)]">{children}</strong>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-black/5 px-1 py-0.5 text-[10px] font-mono text-[var(--timber-dk)]">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[var(--timber)] bg-[#f7f3ec] pl-2.5 py-1 italic text-[11px] my-2 text-[var(--ink)] rounded-r">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  <span className={`mt-1.5 block text-[9px] ${m.role === 'user' ? 'text-white/70 text-right' : 'text-[var(--stone)]'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[var(--stone)]">
                <div className="h-6 w-6 overflow-hidden rounded-full border border-[var(--timber)] bg-[var(--timber)]">
                  <img
                    src="/images/gilbert.jpeg"
                    alt="Gilbert"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-2xl border border-[var(--line)] bg-white px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--timber)]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--timber)] [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--timber)] [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions shown only before user sends first message */}
          {!messages.some(m => m.role === 'user') && (
            <div className="border-t border-[var(--line)]/60 bg-[#f7f3ec] p-2.5 animate-in fade-in duration-200">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--stone)]">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickSuggestions.map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-[11px] text-[var(--graphite)] hover:border-[var(--timber)] hover:text-[var(--timber-dk)] transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-[var(--line)] bg-white p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about VIKM GROUP..."
              className="flex-1 rounded-lg border border-[var(--line)] bg-[#faf7f2] px-3.5 py-2 text-xs text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--timber)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--timber)] text-white transition-colors hover:bg-[var(--timber-dk)] disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
