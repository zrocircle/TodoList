import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function CreateCategoryModal({ onClose, onCreate }) {
  const { currentUser } = useAuth()
  const [name, setName] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState([])
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const addEmail = () => {
    const val = emailInput.trim().toLowerCase()
    if (!val) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (val === currentUser.email) {
      setEmailError('본인은 자동으로 포함됩니다.')
      return
    }
    if (emails.includes(val)) {
      setEmailError('이미 추가된 이메일입니다.')
      return
    }
    setEmails((prev) => [...prev, val])
    setEmailInput('')
    setEmailError('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addEmail() }
  }

  const removeEmail = (email) => setEmails((prev) => prev.filter((e) => e !== email))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await onCreate(name, emails)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">새 카테고리 만들기</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리 이름 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">카테고리 이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 학교, 집, 일"
              autoFocus
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800
                         placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-transparent transition-all"
            />
          </div>

          {/* 멤버 초대 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              멤버 초대 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setEmailError('') }}
                onKeyDown={handleKeyDown}
                placeholder="team@example.com"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800
                           placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                           focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm
                           font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                추가
              </button>
            </div>
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}

            {/* 추가된 이메일 태그 */}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emails.map((email) => (
                  <span key={email}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700
                               text-xs rounded-full border border-indigo-200">
                    {email}
                    <button type="button" onClick={() => removeEmail(email)}
                      className="text-indigo-400 hover:text-indigo-600 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 생성자 자동 포함 안내 */}
            <p className="text-xs text-slate-400 mt-2">
              <span className="font-medium text-slate-500">{currentUser.email}</span> 은(는) 자동으로 포함됩니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium
                         rounded-xl hover:bg-slate-50 transition-colors">
              취소
            </button>
            <button type="submit" disabled={!name.trim() || submitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300
                         disabled:cursor-not-allowed text-white text-sm font-semibold
                         rounded-xl transition-colors flex items-center justify-center gap-2">
              {submitting
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : '만들기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
