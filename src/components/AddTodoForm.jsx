import { useState } from 'react'

export default function AddTodoForm({ onAdd, members = [] }) {
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('') // '' = 모두
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      await onAdd(title, assignedTo || null)
      setTitle('')
      setAssignedTo('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="flex gap-2">
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
          {submitting
            ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>}
          추가
        </button>
      </div>

      {/* 담당자 선택 — 멤버가 2명 이상일 때만 표시 */}
      {members.length >= 2 && (
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs text-slate-400 shrink-0">담당자</span>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg
                       px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300
                       focus:border-transparent cursor-pointer transition-all"
          >
            <option value="">모두</option>
            {members.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>
      )}
    </form>
  )
}
