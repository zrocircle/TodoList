import { useState } from 'react'

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      await onAdd(title)
      setTitle('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새로운 할 일을 입력하세요..."
        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800
                   placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                   focus:border-transparent transition-all shadow-sm"
      />
      <button
        type="submit"
        disabled={!title.trim() || submitting}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed
                   text-white text-sm font-semibold rounded-xl transition-all shadow-sm
                   flex items-center gap-1.5 whitespace-nowrap"
      >
        {submitting ? (
          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
        추가
      </button>
    </form>
  )
}
